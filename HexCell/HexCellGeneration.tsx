import { useState } from "react";
import * as THREE from "three";
import type { HexCoord } from "./HexCoordType.ts";
import type { Account } from "../Accounts/AccountTypes.ts";
import * as unitConv from "../utils/UnitConversions.ts";
import { HexInstance } from "../HexCell/HexInstances.ts";

function HexCell({
    position,
    hexCoord: { q, r },
    account,
}: {
    position: THREE.Vector3;
    hexCoord: HexCoord;
    account: Account;
}) {
    const index = unitConv.getClusterIndexFromHex(account.visualData, {
        q,
        r,
    });
    const [outlineActive, setOutlineActive] = useState(false);
    return (
        <HexInstance
            userData={{
                account: account,
                index: index,
            }}
            position={position}
            color={account.visualData.color}
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

export default function CreateAccountCells({ account }: { account: Account }) {
    const HexCellArray = unitConv
        .getNeighboursHexFromHex(
            account.visualData.centre,
            account.visualData.radius,
            true,
        )
        .map((v) => (
            <HexCell
                key={`cell-${v.q},${v.r}`}
                hexCoord={v}
                position={unitConv.getXYZFromHex(v)}
                account={account}
            />
        ));

    return <group>{HexCellArray}</group>;
}
