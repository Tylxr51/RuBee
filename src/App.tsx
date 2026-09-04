import { InstancedAttribute, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import MakeClusterCells from "../HexCell/HexCellGeneration.tsx";
import * as consts from "../utils/Constants.ts";
import ClusterData from "../ClusterData/ClusterDataClass.ts";
import outlineVertexShader from "../HexCell/shaders/OutlineShader.vert.glsl?raw";
import outlineFragmentShader from "../HexCell/shaders/OutlineShader.frag.glsl?raw";
import { HexInstances } from "../HexCell/HexInstances.ts";
import * as cdFuncs from "../ClusterData/ClusterDataFunctions.ts";
import * as accFuncs from "../Accounts/AccountFunctions.ts";

accFuncs.createSavingsAccount("Account1", 890, { q: -5, r: 5 });
accFuncs.createSavingsAccount("Account2", 200, { q: 4, r: -4 });

// Notes:
// Indexing runs centre outwards, anticlockwise
// Segments run anticlockwise:
// UR - Up Right, UL - Up Left, DR - Down Right

function ClusterManager() {
    const clusterDataArray: ClusterData[] = cdFuncs.getClusterData();
    const clusterHexCellsArray = clusterDataArray.map((clusterData, i) => (
        <MakeClusterCells key={`cluster-${i}`} clusterData={clusterData} />
    ));

    return (
        <>
            <HexInstances
                limit={50000} // Optional: max amount of items (for calculating buffer size)
                range={50000} // Optional: draw-range
                position={[0, 0, 0]}
            >
                <circleGeometry
                    args={[
                        consts.HEX_SIZE, // + consts.HEX_OUTLINE_DOUBLING_ADJUSTMENT // stops overlapping outlines doubling thickness
                        consts.HEX_SIDES,
                        consts.HEX_ROTATION,
                    ]}
                />
                <shaderMaterial
                    vertexShader={outlineVertexShader}
                    fragmentShader={outlineFragmentShader}
                    transparent
                    side={THREE.DoubleSide}
                    uniforms={{
                        outlineThickness: {
                            value: consts.HEX_OUTLINE_THICKNESS,
                        },
                    }}
                ></shaderMaterial>
                <InstancedAttribute name="aOutlineActive" defaultValue={1.0} />
                {clusterHexCellsArray}
            </HexInstances>
        </>
    );
}

export default function CanvasManager() {
    return (
        <>
            <div id="canvas-container" style={{ height: "98vh" }}>
                <Canvas style={{ height: "100%" }}>
                    <OrbitControls />
                    <ClusterManager />
                </Canvas>
            </div>
        </>
    );
}
