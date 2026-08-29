import { Instance, Instances, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";

// Notes:
// Indexing runs centre outwards, anticlockwise
// Segments run anticlockwise:
// UR - Up Right, UL - Up Left, DR - Down Right

type HexCoord = {
    q: number;
    r: number;
};

// Hex constants
const HEX_SIZE = 0.2;
const HEX_SIDES = 6;
const HEX_ROTATION = Math.PI / 2;

// Now redundant, should perhaps define the boundaries of the grid so it isnt infinite?
const GRID_HEX_RADIUS = 4;
const GRID_HEX_COUNT = 3 * GRID_HEX_RADIUS * (GRID_HEX_RADIUS - 1) + 1;

// Trig constants
const COS_PI_OVER_6 = Math.cos(Math.PI / 6);
const COS_PI_OVER_3 = Math.cos(Math.PI / 3);
const SIN_PI_OVER_6 = Math.sin(Math.PI / 6);
const SIN_PI_OVER_3 = Math.sin(Math.PI / 3);

// Hex bases
const q_UNIT_VECTOR = new THREE.Vector3(2 * HEX_SIZE * COS_PI_OVER_6, 0, 0);
const r_UNIT_VECTOR = new THREE.Vector3(
    HEX_SIZE * COS_PI_OVER_6,
    -(HEX_SIZE + HEX_SIZE * SIN_PI_OVER_6),
    0,
);

// Error messages
const ERROR_INVALID_SEGMENT =
    "Invalid segment: Attempted to find a hex not belonging to the three segments or centre";

const getHexPositiveQ = ({ q, r }: HexCoord): HexCoord => {
    return { q: q + 1, r };
};
const getHexNegativeeQ = ({ q, r }: HexCoord): HexCoord => {
    return { q: q - 1, r };
};
const getHexPositiveR = ({ q, r }: HexCoord): HexCoord => {
    return { q, r: r + 1 };
};
const getHexNegativeR = ({ q, r }: HexCoord): HexCoord => {
    return { q, r: r - 1 };
};
const getHexPositiveS = ({ q, r }: HexCoord): HexCoord => {
    return { q: q + 1, r: r - 1 };
};
const getHexNegativeS = ({ q, r }: HexCoord): HexCoord => {
    return { q: q - 1, r: r + 1 };
};

const getClusterIndexFromHex = (
    clusterData: ClusterData,
    { q: hexQ, r: hexR }: HexCoord,
): number => {
    const radius = clusterData.radius;
    const radiusMinusCentre = radius - 1;
    const count = clusterData.count;
    const countMinusCentre = count - 1;
    const { q: clusterCentreQ, r: clusterCentreR }: HexCoord =
        clusterData.centre;

    const q = hexQ - clusterCentreQ;
    const r = hexR - clusterCentreR;

    const centreCondition = r === 0 && q === 0;
    const URSegmentCondition = q >= 1 && r <= 0;
    const ULSegmentCondition = q <= 0 && -q - r >= 1;
    const DRCondition = r >= 0 && -q - r <= 0;

    switch (true) {
        case centreCondition: {
            return 0;
        }
        case URSegmentCondition: {
            return -r * radiusMinusCentre + q;
        }
        case ULSegmentCondition: {
            const s = -q - r;
            return -q * radiusMinusCentre + s + countMinusCentre / 3;
        }
        case DRCondition: {
            const s = -q - r;
            return -s * radiusMinusCentre + r + 2 * (countMinusCentre / 3);
        }
        default: {
            throw new Error(ERROR_INVALID_SEGMENT);
        }
    }
};

const getHexFromClusterIndex = (
    clusterData: ClusterData,
    i: number,
): HexCoord => {
    const radius = clusterData.radius;
    const radiusMinusCentre = radius - 1;
    const count = clusterData.count;
    const countMinusCentre = count - 1;
    const centreOffset = i - 1;
    const { q: clusterCentreQ, r: clusterCentreR }: HexCoord =
        clusterData.centre;

    const segmentCount = countMinusCentre / 3;
    const segment = Math.floor(centreOffset / segmentCount);
    const column = centreOffset % radiusMinusCentre;
    const row = Math.floor(centreOffset / radiusMinusCentre);
    const segmentShift = countMinusCentre / (radiusMinusCentre * 3);

    switch (segment) {
        case -1: {
            // centre
            return { q: clusterCentreQ, r: clusterCentreR };
        }
        case 0: {
            // UR segment
            const q = column + 1;
            const r = -row;
            return { q: q + clusterCentreQ, r: r + clusterCentreR };
        }
        case 1: {
            // UL segment
            const q = -(row - segmentShift);
            const r = -column - q - 1;
            return { q: q + clusterCentreQ, r: r + clusterCentreR };
        }
        case 2: {
            // DR segment
            const r = column + 1;
            const q = row - r - 2 * segmentShift;
            return { q: q + clusterCentreQ, r: r + clusterCentreR };
        }
        default: {
            // error handling
            throw new Error(ERROR_INVALID_SEGMENT);
        }
    }
};

const makeHexCoordsArrFromQRArr = (
    rowArr: number[],
    rowIncrement: number,
    colArr: number[],
    colIncrement: number,
    rIsRow: boolean,
): HexCoord[] => {
    return rowArr.flatMap((row, rowi) =>
        colArr.map((col, coli) =>
            rIsRow
                ? {
                      q: col + rowi * colIncrement,
                      r: row + coli * rowIncrement,
                  }
                : {
                      q: row + coli * rowIncrement,
                      r: col + rowi * colIncrement,
                  },
        ),
    );
};

const getNeighboursHexFromHex = (
    { q: cq, r: cr }: HexCoord,
    radius: number,
    includeCentre: boolean,
): HexCoord[] => {
    const radiusMinusCentre = radius - 1;

    // UR segment
    const URSegmentRValues = Array.from({ length: radius }, (_, i) => -i + cr);
    const URSegmentQValues = Array.from(
        { length: radiusMinusCentre },
        (_, i) => i + 1 + cq,
    );
    const ArrURSegmentHexCoords = makeHexCoordsArrFromQRArr(
        URSegmentRValues,
        0,
        URSegmentQValues,
        0,
        true,
    );

    // UL segment
    const ULSegmentRValues = Array.from(
        { length: radiusMinusCentre },
        (_, i) => -i - 1 + cr,
    );
    const ULSegmentQValues = Array.from({ length: radius }, (_, i) => -i + cq);
    const ArrULSegmentHexCoords = makeHexCoordsArrFromQRArr(
        ULSegmentQValues,
        0,
        ULSegmentRValues,
        1,
        false,
    );

    // DR segment
    const DRSegmentRValues = Array.from(
        { length: radiusMinusCentre },
        (_, i) => i + 1 + cr,
    );
    const DRSegmentQValues = Array.from(
        { length: radius },
        (_, i) => i - 1 + cq,
    );
    const ArrDRSegmentHexCoords = makeHexCoordsArrFromQRArr(
        DRSegmentRValues,
        0,
        DRSegmentQValues,
        -1,
        true,
    );

    const NeighbourArray = [
        ...ArrURSegmentHexCoords,
        ...ArrULSegmentHexCoords,
        ...ArrDRSegmentHexCoords,
    ];

    if (includeCentre) {
        NeighbourArray.push({ q: cq, r: cr });
    }

    return NeighbourArray;
};

const getXYZFromHex = ({ q, r }: HexCoord): THREE.Vector3 => {
    return new THREE.Vector3().addVectors(
        q_UNIT_VECTOR.clone().multiplyScalar(q),
        r_UNIT_VECTOR.clone().multiplyScalar(r),
    );
};

function HexCell({
    position,
    hexCoord: { q, r },
    clusterData,
}: {
    position: THREE.Vector3;
    hexCoord: HexCoord;
    clusterData: ClusterData;
}) {
    // const nicecoloring = new THREE.Color().setRGB(
    //     (position.x / 70 + 0.2) / 2,
    //     (position.y / 70 + 0.1) / 2,
    //     (position.x / 140 + 0.2) / 2,
    // );
    const color =
        q >= 1 && r <= 0 ? "red" : q <= 0 && -q - r >= 1 ? "green" : "blue";
    const index = getClusterIndexFromHex(clusterData, { q, r });
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
    const clusterArray = getNeighboursHexFromHex(
        clusterData.centre,
        clusterData.radius,
        true,
    ).map((v) => (
        <HexCell
            key={`${v.q},${v.r}`}
            hexCoord={v}
            position={getXYZFromHex(v)}
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
        <Instances
            limit={50000} // Optional: max amount of items (for calculating buffer size)
            range={50000} // Optional: draw-range
        >
            <circleGeometry args={[HEX_SIZE, HEX_SIDES, HEX_ROTATION]} />
            <meshBasicMaterial side={THREE.DoubleSide} />
            <HexCluster clusterData={cluster1} />
            <HexCluster clusterData={cluster2} />
            <HexCluster clusterData={cluster3} />
            <HexCluster clusterData={cluster4} />
        </Instances>
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

class ClusterData {
    clusterName: string;
    centre: HexCoord;
    radius: number;
    color: THREE.Color;
    count: number;
    clusterArray: number[];

    constructor(
        clusterName: string,
        centre: HexCoord,
        radius: number,
        color: THREE.Color,
    ) {
        this.clusterName = clusterName;
        this.centre = centre;
        this.radius = radius;
        this.color = color;
        this.count = 3 * this.radius * (this.radius - 1) + 1;
        this.clusterArray = Array.from({ length: this.count }, (_, i) => 2 * i);
    }
}
