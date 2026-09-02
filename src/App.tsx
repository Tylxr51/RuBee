import {
    Circle,
    Instance,
    Instances,
    OrbitControls,
    Outlines,
    Wireframe,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import type { HexCoord } from "../types/HexCoord.ts";
import * as utils from "../utils/Constants.ts";
import * as move from "../utils/AdjacentHexMovements.ts";
import ClusterData from "../utils/ClusterData.ts";
import * as uc from "../utils/UnitConversions.ts";
import outlineVertexShader from "../shaders/OutlineShader.vert.glsl?raw";
import outlineFragmentShader from "../shaders/OutlineShader.frag.glsl?raw";

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
    const index = uc.getClusterIndexFromHex(clusterData, { q, r });
    return (
        <Instance
            userData={{
                hexCoord: { q, r },
                clusterName: clusterData.clusterName,
                clusterArrayValue: clusterData.clusterArray[index],
                index: index,
            }}
            position={position}
            color={clusterData.color}
            onPointerEnter={(e) => {
                console.log(e.object.userData);
            }}
        ></Instance>
    );
}

function HexCluster({ clusterData }: { clusterData: ClusterData }) {
    const clusterArray = uc
        .getNeighboursHexFromHex(clusterData.centre, clusterData.radius, true)
        .map((v) => (
            <HexCell
                key={`${v.q},${v.r}`}
                hexCoord={v}
                position={uc.getXYZFromHex(v)}
                clusterData={clusterData}
            ></HexCell>
        ));

    return <group>{clusterArray}</group>;
}

function HexInstances() {
    const cluster1 = new ClusterData(
        "one",
        { q: 0, r: 0 },
        3,
        new THREE.Color(1, 1, 0),
    );
    const cluster2 = new ClusterData(
        "two",
        { q: 5, r: 3 },
        4,
        new THREE.Color(0, 1, 1),
    );
    const cluster3 = new ClusterData(
        "three",
        { q: -8, r: -4 },
        6,
        new THREE.Color(1, 0, 1),
    );
    const cluster4 = new ClusterData(
        "four",
        { q: 8, r: -4 },
        2,
        new THREE.Color(1, 1, 1),
    );

    return (
        <>
            <Instances
                limit={50000} // Optional: max amount of items (for calculating buffer size)
                range={50000} // Optional: draw-range
            >
                <circleGeometry
                    args={[utils.HEX_SIZE, utils.HEX_SIDES, utils.HEX_ROTATION]}
                />
                <meshBasicMaterial side={THREE.DoubleSide} />
                <HexCluster clusterData={cluster1} />
                <HexCluster clusterData={cluster2} />
                <HexCluster clusterData={cluster3} />
                <HexCluster clusterData={cluster4} />
            </Instances>

            <Instances
                limit={50000} // Optional: max amount of items (for calculating buffer size)
                range={50000} // Optional: draw-range
                position={[0, 0, 0.002]}
            >
                <circleGeometry
                    args={[utils.HEX_SIZE, utils.HEX_SIDES, utils.HEX_ROTATION]}
                />
                <shaderMaterial
                    vertexShader={outlineVertexShader}
                    fragmentShader={outlineFragmentShader}
                    transparent
                    side={THREE.DoubleSide}
                />
                <HexCluster clusterData={cluster1} />
                <HexCluster clusterData={cluster2} />
                <HexCluster clusterData={cluster3} />
                <HexCluster clusterData={cluster4} />
            </Instances>
        </>
    );
}

export default function Manager() {
    return (
        <>
            <div id="canvas-container" style={{ height: "98vh" }}>
                <Canvas style={{ height: "100%" }}>
                    <OrbitControls />
                    <HexInstances />
                </Canvas>
            </div>
        </>
    );
}
