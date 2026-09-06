import * as THREE from "three";

// Hex constants
export const HEX_SIZE = 0.2;
export const HEX_SIDES = 6;
export const HEX_ROTATION = Math.PI / 2;
export const HEX_OUTLINE_THICKNESS = 0.03;
export const HEX_OUTLINE_DOUBLING_ADJUSTMENT = HEX_OUTLINE_THICKNESS / 4;
export const HEX_VALUE = 10; // make adjustable in future

// Now redundant, should perhaps define the boundaries of the grid so it isnt infinite?
// const GRID_HEX_RADIUS = 4;
// const GRID_HEX_COUNT = 3 * GRID_HEX_RADIUS * (GRID_HEX_RADIUS - 1) + 1;

// Trig constants
export const COS_PI_OVER_6 = Math.cos(Math.PI / 6);
export const SIN_PI_OVER_6 = Math.sin(Math.PI / 6);

// Hex bases
export const q_UNIT_VECTOR = new THREE.Vector3(
    2 * HEX_SIZE * COS_PI_OVER_6,
    0,
    0,
);
export const r_UNIT_VECTOR = new THREE.Vector3(
    HEX_SIZE * COS_PI_OVER_6,
    -(HEX_SIZE + HEX_SIZE * SIN_PI_OVER_6),
    0,
);

// Error messages
export const ERROR_INVALID_SEGMENT =
    "Invalid segment: Attempted to find a hex not belonging to the three segments or centre";

// List of colors for hex clusters https://sashamaps.net/docs/resources/20-colors/
export const CLUSTER_COLORS = [
    "#e6194B",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#42d4f4",
    "#f032e6",
    "#bfef45",
    "#fabed4",
    "#469990",
    "#dcbeff",
    "#9A6324",
    "#fffac8",
    "#800000",
    "#aaffc3",
    "#808000",
    "#ffd8b1",
    "#000075",
    "#a9a9a9",
].reverse();
