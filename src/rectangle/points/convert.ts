import {IRectanglePoint, MidPoint, Side} from "./types";
import RectanglePoint from "./RectanglePoint";
import {isCenterX, isXName} from "./booleans";

/**
 * Can switch between an IRectanglePoint object interface and the classed object
 *
 * Primary used for jest testing.
 */

/**
 * strip any object fulfilling the interface to just the interface props, discarding the rest
 */
export const toRPointProps = (obj: IRectanglePoint): IRectanglePoint => ({
    x: obj.x,
    y: obj.y,
    xName: obj.xName,
    yName: obj.yName,
});

/**
 * this check isn't entirely necessary because it will work fine to always construct a new class,
 * but this function will return the existing class if it's already a class rather than constructing a new instance.
 */
export const toRPointClass = (obj: IRectanglePoint): RectanglePoint => {
    if (obj instanceof RectanglePoint) {
        return obj;
    } else {
        return new RectanglePoint(obj);
    }
}

/**
 * get the point name which is the midpoint of the given side
 */
export const sideToMidpoint = (side: Side): MidPoint => {
    return isXName(side)
        ? {
            xName: side,
            yName: "ymid",
        }
        : {
            xName: "xmid",
            yName: side,
        };
};

/**
 * get the side which a midpoint is on
 */
export const midpointToSide = (point: MidPoint): Side => {
    return isCenterX(point) ? point.yName : point.xName;
};
