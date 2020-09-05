import {XY} from "./types";
import {isSameValue} from "../sized/sized-util";

/**
 * see if two positions have the same x and y values
 */
export const isSameXY = (a: XY, b: XY, margin?: number) => {
    return isSameValue(a.x, b.x, margin) && isSameValue(a.y, b.y, margin);
}

/**
 * find the distance along the diagonal between two points
 */
export const distance = (a: XY, b: XY): number => {
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

/**
 * find an XY pair with the x change and the x change between two points
 * order matters -- the first point is the translated point and the second is the original point to apply the
 * translation to
 */
export const translation = (current: XY, basis: XY): XY => {
    return {
        x: current.x - basis.x,
        y: current.y - basis.y,
    }
}
