import {isSameValue} from "../sized/compare";
import {XY} from "../coreTypes";

/**
 * See if two positions have the same x and y values, with an optional margin to account for rounding errors.
 */
export const isSameXY = (a: XY, b: XY, margin?: number) => {
    return isSameValue(a.x, b.x, margin) && isSameValue(a.y, b.y, margin);
}

/**
 * Find the distance along the diagonal between two points. Order does not matter.
 */
export const distance = (a: XY, b: XY): number => {
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

/**
 * Find an XY pair with the x change and the x change between two points.
 * Order matters -- the first point is the translated point and the second is the original point to apply the
 * translation to.
 */
export const translation = (current: XY, basis: XY): XY => {
    return {
        x: current.x - basis.x,
        y: current.y - basis.y,
    }
}
