import { createInstances } from "@react-three/drei";
import type { HexShaderAttributes } from "./shaders/HexShaderAttributes.ts";

export const [HexInstances, HexInstance] =
    createInstances<HexShaderAttributes>();
