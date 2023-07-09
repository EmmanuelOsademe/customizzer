"use client"

import {useFrame} from "@react-three/fiber";
import {easing} from "maath";
import { useSnapshot } from "valtio";
import state from "@/store";
import { useRef } from "react";
import { Euler, Group } from "three";

interface Props {
    children: React.ReactNode
}

const CameraRig: React.FC<Props> = ({children}) => {
    const snap = useSnapshot(state);
    const groupRef = useRef<Group>(null);
    
    useFrame((state, delta) => {
        const isBreakpoint = window.innerWidth <= 1260;
        const isMobile = window.innerWidth <= 600;

        // Set the initial position of the model
        let targetPosition = [-0.4, 0, 2] as [x: number, y: number, z: number];
        if(snap.intro){
            if(isBreakpoint) targetPosition = [0, 0, 2];
            if(isMobile) targetPosition = [0, 0.2, 2.5];
        }else {
            if(isMobile) targetPosition = [0, 0, 2.5];
            else targetPosition = [0, 0, 2]
        }

        // Set model camera position
        easing.damp3(state.camera.position, targetPosition, 0.25, delta)

        // Set the model rotation smoothly
        easing.dampE(
            groupRef.current?.rotation as any as Euler,
            [state.pointer.y / 10, -state.pointer.x/5, 0],
            0.25,
            delta
        )
    })

    return (
        <group ref={groupRef} >
            {children}
        </group>
    )
}

export default CameraRig;