import { TabInterface } from "@/common.types";
import { useSnapshot } from "valtio";
import state from "@/store";
import Image from "next/image";

interface Props {
    tab: TabInterface;
    isFilterTab?: boolean;
    isActiveTab?: boolean;
    handleClick: () => void;
}

const Tab: React.FC<Props> = ({tab, isActiveTab, isFilterTab, handleClick}) => {
    const snap = useSnapshot(state);

    const activeStyles = isFilterTab && isActiveTab 
        ? {backgroundColor: snap.color, opacity: 0.5}
        : {backgroundColor: "transparent", opacity: 1}

    return (
        <div
            key={tab.name}
            className={`tab-btn ${isFilterTab ? "rounded-full glassmorphism" : "rounded-md"}`}
            onClick={handleClick}
            style={activeStyles}
        >
            <Image 
                src={tab.icon}
                alt={tab.name}
                className={`${isFilterTab ? 'w-2/3 h-2/3' : 'w-11/12 h-11/12'} object-contain`}
            />
        </div>
    )
}

export default Tab;