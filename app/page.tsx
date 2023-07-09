"use client";

import {motion, AnimatePresence} from "framer-motion";
import {useSnapshot} from "valtio";
import {
    headContainerAnimation, 
    headContentAnimation,
    headTextAnimation,
    slideAnimation
} from "@/config/motion";
import state from "@/store";
import Image from "next/image";
import { CustomButton } from "@/components";
import {useRouter} from "next/navigation";

const Home: React.FC = () => {
    const snap = useSnapshot(state);
    const router = useRouter()

    return (
        <AnimatePresence>
            {snap.intro && (
                <motion.section className="home" {...slideAnimation("left")}>
                    <motion.header {...slideAnimation("down")}>
                        <Image 
                            src="/threejs.png"
                            alt="threejs logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </motion.header>
                    <motion.div className="home-content" {...headContainerAnimation}>
                        <motion.div {...headTextAnimation}>
                            <h1 className="head-text">LET'S <br className="xl:block hidden"/>DO IT</h1>
                        </motion.div>
                        <motion.div className="flex flex-col gap-5" {...headContentAnimation}>
                            <p className="max-w-md font-normal text-gray-600  text-base">
                                Create your unique and exclusive shirt with our brand-new 3-D customization tool. 
                                <strong> Unleash your imagination</strong>{" "} and define your style
                            </p>
                            <CustomButton 
                                type="filled"
                                title="Customize It"
                                handleClick={() => [state.intro = false, router.push("/customizer")]}
                                customStyles="w-fit px-4 py-2.5 font-bold text-small"
                            />
                        </motion.div>
                    </motion.div>
                </motion.section>
            )}
        </AnimatePresence>
    )
}

export default Home;