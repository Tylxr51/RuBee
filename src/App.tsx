import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import VisualiseAccounts from "../Accounts/VisualiseAccounts.tsx";
import { Sidebar } from "../Menu/Menu.tsx";
import { AccountsProvider } from "../Accounts/accountsProvider.tsx";

// Notes:
// Indexing runs centre outwards, anticlockwise
// Segments run anticlockwise:
// UR - Up Right, UL - Up Left, DR - Down Right

export default function CanvasManager() {
    return (
        <>
            <div
                id="canvas-container"
                style={{ height: "90vh", width: "98vw" }}
            >
                <AccountsProvider>
                    <Canvas style={{ height: "100%" }}>
                        <OrbitControls />
                        <VisualiseAccounts />
                    </Canvas>
                    <Sidebar />
                </AccountsProvider>
            </div>
        </>
    );
}
