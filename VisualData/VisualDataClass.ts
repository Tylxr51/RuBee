import * as THREE from "three";
import type { HexCoord } from "../HexCell/HexCoordType.ts";

export default class VisualData {
    centre: HexCoord;
    radius: number;
    color: THREE.Color;
    clusterCount: number;
    clusterArray: number[];

    constructor(centre: HexCoord, radius: number, color: THREE.Color) {
        this.centre = centre;
        this.radius = radius;
        this.color = color;
        this.clusterCount = 3 * this.radius * (this.radius - 1) + 1;
        this.clusterArray = Array.from(
            { length: this.clusterCount },
            (_, i) => 2 * i,
        );
    }
}
