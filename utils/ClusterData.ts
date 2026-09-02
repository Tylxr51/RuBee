import * as THREE from "three";
import type { HexCoord } from "../types/HexCoord.ts";

export default class ClusterData {
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
