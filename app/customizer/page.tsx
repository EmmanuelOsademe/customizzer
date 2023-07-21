"use client";
import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useSnapshot} from "valtio";
import state from "@/store";
import { download } from "@/assets";
import { reader } from "@/config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "@/config/constants";
import { fadeAnimation, slideAnimation } from "@/config/motion";
import {AiPicker, ColorPicker, FilePicker, Tab, CustomButton} from "@/components";
import { TabInterface } from "@/common.types";
import { useRouter } from "next/navigation";
import { downloadImage } from "@/utils";

const Customizer: React.FC = () => {
    const snap = useSnapshot(state);
    const router = useRouter();

    const [file, setFile] = useState<File | "">("");
    const [prompt, setPrompt] = useState<string>("");
    const [generatingImg, setGeneratingImg] = useState<boolean>(false);
    const [activeEditorTab, setActiveEditorTab] = useState<string>("");
    const [activeFilterTab, setActiveFilterTab] = useState<{logoShirt: boolean, stylishShirt: boolean}>({
        logoShirt: true,
        stylishShirt: false
    });


    // Show tab content depending on activeTab
    const generateTabContent = () => {
        switch(activeEditorTab){
            case "colorpicker": 
                return <ColorPicker />
            case "filepicker":
                return <FilePicker 
                    file={file}
                    setFile={setFile}
                    readFile={readFile}
                />
            case "aipicker":
                return <AiPicker 
                    prompt={prompt}
                    setPrompt={setPrompt}
                    generatingImg={generatingImg}
                    handleSubmit={handleSubmit}
                />
            default:
                return null;
        }
    }

    const handleSubmit = async (type: "logo" | "full") => {
        if(!prompt) return alert("Please enter a prompt");

        try {
            // Call our backend to generate an AI Image
            setGeneratingImg(true);

            const response = await fetch("/api/dalle", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({prompt})
            });

            const data = await response.json();
            handleDecals(type, `data:image/png;base64,${data.photo}`)
        } catch (e: any) {
            alert(e.message);
        } finally {
            setGeneratingImg(false);
            setActiveEditorTab("");
        }
    }

    const handleDecals = (type: "logo" | "full", result: any) => {
        const stateProperty: "fullDecal" | "logoDecal" = DecalTypes[type].stateProperty as "fullDecal" | "logoDecal";
        const filterTab: "logoShirt" | "stylishShirt" = DecalTypes[type].filterTab as "logoShirt" | "stylishShirt"
        
        state[stateProperty] = result;
        if(!activeFilterTab[filterTab]){
            handleActiveFilterTab(filterTab);
        }
    }

    const handleActiveFilterTab = (tabName: string) => {
        switch(tabName) {
            case "logoShirt": 
                state.isLogoTexture = !activeFilterTab[tabName]
                break;
            case "stylishShirt":
                state.isFullTexture = !activeFilterTab[tabName]
                break;
            default:
                state.isFullTexture = false;
                state.isLogoTexture = true;
                
        }

        // After setting the state, updated the activeFilterTab
        setActiveFilterTab((prevState) => {
            return {
                ...prevState,
                [tabName]: !prevState[tabName as "logoShirt" | "stylishShirt"]
            }
        })
    }

    const readFile = (type: "logo" | "full") => {
        if(!file) return

        reader(file)
            .then((result: any) => {
                console.log(result);
                handleDecals(type, result);
                setActiveEditorTab("");
            })
    }
    
    return (
        <AnimatePresence>
            {!snap.intro && (
                <>
                    <motion.div
                        key="custom"
                        className="absolute top-0 left-0 z-10"
                        {...slideAnimation("left")}
                    >
                        <div className="flex items-center min-h-screen">
                            <div className="editortabs-container tabs">
                                {EditorTabs.map((tab: TabInterface) => (
                                    <Tab 
                                        key={tab.name}
                                        tab={tab}
                                        handleClick={() => setActiveEditorTab(tab.name)}
                                    />
                                ))}
                                {generateTabContent()}
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        className="absolute z-10 top-5 right-5"
                        {...fadeAnimation}
                    >
                        <CustomButton 
                            type="filled"
                            title="Go back"
                            handleClick={() => [state.intro = true, router.push("/")]}
                            customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                        />
                    </motion.div>
                    <motion.div
                        className="filtertabs-container"
                        {...slideAnimation("up")}
                    >
                        {FilterTabs.map((tab: TabInterface) => (
                            <Tab 
                                key={tab.name}
                                tab={tab}
                                isFilterTab
                                isActiveTab={activeFilterTab[tab.name as "logoShirt" | "stylishShirt"]}
                                handleClick={() => handleActiveFilterTab(tab.name)}
                            />
                        ))}
                        <Tab tab={{name: "download", icon: download}} handleClick={() => downloadImage("", "")}/>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Customizer;