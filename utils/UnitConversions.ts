import * as THREE from "three";
import type { HexCoord } from "../types/HexCoord.ts";
import * as utils from "./Constants.ts";
import ClusterData from "./ClusterData.ts";

export const getClusterIndexFromHex = (
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
            throw new Error(utils.ERROR_INVALID_SEGMENT);
        }
    }
};

export const getHexFromClusterIndex = (
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
            throw new Error(utils.ERROR_INVALID_SEGMENT);
        }
    }
};

export const makeHexCoordsArrFromQRArr = (
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

export const getNeighboursHexFromHex = (
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

export const getXYZFromHex = ({ q, r }: HexCoord): THREE.Vector3 => {
    return new THREE.Vector3().addVectors(
        utils.q_UNIT_VECTOR.clone().multiplyScalar(q),
        utils.r_UNIT_VECTOR.clone().multiplyScalar(r),
    );
};
