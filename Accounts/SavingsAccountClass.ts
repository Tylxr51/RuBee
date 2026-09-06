import * as THREE from "three";
import * as consts from "../utils/Constants";
import type { HexCoord } from "../HexCell/HexCoordType";
import VisualData from "../VisualData/VisualDataClass";

export default class SavingsAccount {
    accountName: string;
    goalAmount: number;
    hexCount: number;
    visualData: VisualData;

    constructor(
        accountName: string,
        goalAmount: number,
        clusterCentre: HexCoord,
    ) {
        this.accountName = accountName;
        this.goalAmount = goalAmount;
        this.hexCount = Math.ceil(goalAmount / consts.HEX_VALUE);

        const clusterRadius = Math.ceil(
            (1 + Math.sqrt(1 + (4 * (this.hexCount - 1)) / 3)) / 2, // solve quadratic
        );
        const clusterColor = new THREE.Color(consts.CLUSTER_COLORS.pop());

        this.visualData = new VisualData(
            clusterCentre,
            clusterRadius,
            clusterColor,
        );
    }
}
