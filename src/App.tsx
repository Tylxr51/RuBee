import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import VisualiseAccounts from "../Accounts/VisualiseAccounts.tsx";
import * as accFuncs from "../Accounts/AccountFunctions.ts";

accFuncs.createSavingsAccount("Account1", 890, { q: -5, r: 5 });
accFuncs.createSavingsAccount("Account2", 200, { q: 4, r: -4 });

// Notes:
// Indexing runs centre outwards, anticlockwise
// Segments run anticlockwise:
// UR - Up Right, UL - Up Left, DR - Down Right

export default function CanvasManager() {
    return (
        <>
            <div id="canvas-container" style={{ height: "98vh" }}>
                <Canvas style={{ height: "100%" }}>
                    <OrbitControls />
                    <VisualiseAccounts />
                </Canvas>
            </div>
        </>
    );
}
