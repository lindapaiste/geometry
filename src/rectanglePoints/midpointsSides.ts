import {isCenterX, isXName} from "./booleans";
import {MidPoint, Side} from "./enums";

export const sideMidpoint = (side: Side): MidPoint => {
    return isXName(side) ? {
        xName: side,
        yName: 'ymid'
    } : {
        xName: 'xmid',
        yName: side,
    }
}
export const midpointSide = (point: MidPoint): Side => {
    return isCenterX(point) ? point.yName : point.xName;
}
