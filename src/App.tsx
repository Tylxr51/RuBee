import { InstancedAttribute, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";
import type { HexCoord } from "../HexCell/HexCoord.ts";
import * as consts from "../utils/Constants.ts";
import ClusterData from "../ClusterData/ClusterDataClass.ts";
import * as unitConv from "../utils/UnitConversions.ts";
import outlineVertexShader from "../HexCell/shaders/OutlineShader.vert.glsl?raw";
import outlineFragmentShader from "../HexCell/shaders/OutlineShader.frag.glsl?raw";
import { HexInstances, HexInstance } from "../HexCell/HexInstances.ts";
import * as cdFuncs from "../ClusterData/ClusterDataFunctions.ts";

// Notes:
// Indexing runs centre outwards, anticlockwise
// Segments run anticlockwise:
// UR - Up Right, UL - Up Left, DR - Down Right

function HexCell({
    position,
    hexCoord: { q, r },
    clusterData,
}: {
    position: THREE.Vector3;
    hexCoord: HexCoord;
    clusterData: ClusterData;
}) {
    const index = unitConv.getClusterIndexFromHex(clusterData, { q, r });
    const [outlineActive, setOutlineActive] = useState(false);
    return (
        <HexInstance
            userData={{
                hexCoord: { q, r },
                clusterName: clusterData.clusterName,
                clusterArrayValue: clusterData.clusterArray[index],
                index: index,
            }}
            position={position}
            color={clusterData.color}
            onPointerEnter={() => {
                setOutlineActive(true);
            }}
            onPointerLeave={() => {
                setOutlineActive(false);
            }}
            onClick={(e) => {
                console.log(e.object.userData);
            }}
            aOutlineActive={outlineActive}
        ></HexInstance>
    );
}

function MakeClusterCells({ clusterData }: { clusterData: ClusterData }) {
    const clusterArray = unitConv
        .getNeighboursHexFromHex(clusterData.centre, clusterData.radius, true)
        .map((v) => (
            <HexCell
                key={`cell-${v.q},${v.r}`}
                hexCoord={v}
                position={unitConv.getXYZFromHex(v)}
                clusterData={clusterData}
            />
        ));

    return <group>{clusterArray}</group>;
}

function ClusterManager() {
    const clusterDataArray: ClusterData[] = cdFuncs.getClusterData();
    const clusterHexCellsArray = clusterDataArray.map((clusterData, i) => (
        <MakeClusterCells key={`solidCluster-${i}`} clusterData={clusterData} />
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
