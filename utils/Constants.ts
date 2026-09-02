import * as THREE from "three";

// Hex constants
export const HEX_SIZE = 0.2;
export const HEX_SIDES = 6;
export const HEX_ROTATION = Math.PI / 2;

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
