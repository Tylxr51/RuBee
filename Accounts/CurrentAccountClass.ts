import * as THREE from "three";
import * as consts from "../utils/Constants";
import type { HexCoord } from "../HexCell/HexCoord";
import ClusterData from "../ClusterData/ClusterDataClass";

export default class CurrentAccount {
    accountName: string;
    goalAmount: number;
    clusterCentre: HexCoord;
    hexCount: number;
    clusterRadius: number;
    clusterData: ClusterData;
    clusterColor: THREE.Color;

    constructor(
        accountName: string,
        goalAmount: number,
        clusterCentre: HexCoord,
    ) {
        this.accountName = accountName;
        this.goalAmount = goalAmount;
        this.clusterCentre = clusterCentre;
        this.hexCount = Math.ceil(goalAmount / consts.HEX_VALUE);
        this.clusterRadius = Math.ceil(
            (1 + Math.sqrt(1 + (4 * (this.hexCount - 1)) / 3)) / 2,
        );
        this.clusterColor = new THREE.Color(consts.CLUSTER_COLORS.pop());
        this.clusterData = new ClusterData(
            this.accountName,
            this.clusterCentre,
            this.clusterRadius,
            this.clusterColor,
        );
    }
}
