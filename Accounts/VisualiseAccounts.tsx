import { InstancedAttribute } from "@react-three/drei";
import * as THREE from "three";
import CreateAccountCells from "../HexCell/HexCellGeneration.tsx";
import * as consts from "../utils/Constants.ts";
import outlineVertexShader from "../HexCell/shaders/OutlineShader.vert.glsl?raw";
import outlineFragmentShader from "../HexCell/shaders/OutlineShader.frag.glsl?raw";
import { HexInstances } from "../HexCell/HexInstances.ts";
import * as accFuncs from "./AccountFunctions.ts";

export default function VisualiseAccounts() {
    const accountsArray = accFuncs.getAccountsArray();
    const accountsHexCellsArray = accountsArray.map((account) => (
        <CreateAccountCells key={account.accountName} account={account} />
    ));

    return (
        <>
            <HexInstances
                limit={50000} // Optional: max amount of items (for calculating buffer size)
                range={50000} // Optional: draw-range
                position={[0, 0, 0]}
            >
                <circleGeometry
                    args={[
                        consts.HEX_SIZE, // + consts.HEX_OUTLINE_DOUBLING_ADJUSTMENT // stops overlapping outlines doubling thickness
                        consts.HEX_SIDES,
                        consts.HEX_ROTATION,
                    ]}
                />
                <shaderMaterial
                    vertexShader={outlineVertexShader}
                    fragmentShader={outlineFragmentShader}
                    transparent
                    side={THREE.DoubleSide}
                    uniforms={{
                        outlineThickness: {
                            value: consts.HEX_OUTLINE_THICKNESS,
                        },
                    }}
                ></shaderMaterial>
                <InstancedAttribute
                    name="aOutlineActive"
                    defaultValue={false}
                />
                {accountsHexCellsArray}
            </HexInstances>
        </>
    );
}
