import type { HexCoord } from "./HexCoord.ts";

export const getHexPositiveQ = ({ q, r }: HexCoord): HexCoord => {
    return { q: q + 1, r };
};
export const getHexNegativeeQ = ({ q, r }: HexCoord): HexCoord => {
    return { q: q - 1, r };
};
export const getHexPositiveR = ({ q, r }: HexCoord): HexCoord => {
    return { q, r: r + 1 };
};
export const getHexNegativeR = ({ q, r }: HexCoord): HexCoord => {
    return { q, r: r - 1 };
};
export const getHexPositiveS = ({ q, r }: HexCoord): HexCoord => {
    return { q: q + 1, r: r - 1 };
};
export const getHexNegativeS = ({ q, r }: HexCoord): HexCoord => {
    return { q: q - 1, r: r + 1 };
};
