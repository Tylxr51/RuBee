import { useState } from "react";
import * as THREE from "three";
import type { HexCoord } from "../HexCell/HexCoord.ts";
import ClusterData from "../ClusterData/ClusterDataClass.ts";
import * as unitConv from "../utils/UnitConversions.ts";
import { HexInstance } from "../HexCell/HexInstances.ts";

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

export default function MakeClusterCells({
    clusterData,
}: {
    clusterData: ClusterData;
}) {
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
