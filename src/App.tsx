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

const GRID_HEX_RADIUS = 4;
const GRID_HEX_COUNT = 3 * GRID_HEX_RADIUS * (GRID_HEX_RADIUS - 1) + 1;

const COUNT_MINUS_CENTRE = GRID_HEX_COUNT - 1;
const RADIUS_MINUS_CENTRE = GRID_HEX_RADIUS - 1;

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
}: {
    position: THREE.Vector3;
    hexCoord: HexCoord;
}) {
    // const nicecoloring = new THREE.Color().setRGB(
    //     (position.x / 70 + 0.2) / 2,
    //     (position.y / 70 + 0.1) / 2,
    //     (position.x / 140 + 0.2) / 2,
    // );
    return (
        <Instance
            position={position}
            color={
                q >= 1 && r <= 0
                    ? "red"
                    : q <= 0 && -q - r >= 1
                      ? "green"
                      : "blue"
            }
        ></Instance>
    );
}

function HexCluster({
    centre: { q, r },
    radius,
}: {
    centre: HexCoord;
    radius: number;
}) {
    const clusterArray = getNeighboursHexFromHex({ q, r }, radius, true).map(
        (v) => (
            <HexCell
                key={`${v.q},${v.r}`}
                hexCoord={v}
                position={getXYZFromHex(v)}
            ></HexCell>
        ),
    );

    return <group>{clusterArray}</group>;
}

function HexInstances() {
    return (
        <Instances
            limit={50000} // Optional: max amount of items (for calculating buffer size)
            range={50000} // Optional: draw-range
        >
            <circleGeometry args={[HEX_SIZE, HEX_SIDES, HEX_ROTATION]} />
            <meshBasicMaterial side={THREE.DoubleSide} />
            <HexCluster centre={{ q: 0, r: 0 }} radius={3} />
            <HexCluster centre={{ q: 5, r: 3 }} radius={4} />
            <HexCluster centre={{ q: -8, r: -4 }} radius={6} />
            <HexCluster centre={{ q: 8, r: -4 }} radius={2} />
        </Instances>
    );
}

export default function Manager() {
    return (
        <>
            <div
                id="canvas-container"
                style={{ width: "95vw", height: "95vh" }}
            >
                <Canvas style={{ height: "100%" }}>
                    <OrbitControls />
                    <HexInstances />
                </Canvas>
            </div>
        </>
    );
}
