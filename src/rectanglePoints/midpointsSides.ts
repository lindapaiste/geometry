import {isCenterX, isXName} from "./booleans";
import {MidPoint, Side} from "./types";

/**
 * get the point name which is the midpoint of the given side
 */
export const sideMidpoint = (side: Side): MidPoint => {
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
export const midpointSide = (point: MidPoint): Side => {
    return isCenterX(point) ? point.yName : point.xName;
};
