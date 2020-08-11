/**
 * Enum for rectangle side names
 * @readonly
 * @enum {string}
 */
import {isCenterX, isXName} from "./booleans";

export enum SIDES {
    LEFT = 'x1',
    RIGHT = 'x2',
    TOP = 'y1',
    BOTTOM = 'y2',
}

export type XSides = SIDES.LEFT | SIDES.RIGHT;
export type YSides = SIDES.TOP | SIDES.BOTTOM;

/**
 * Enum for rectangle center names
 * @readonly
 * @enum {string}
 */
export enum CENTERS {
    X = 'xmid',
    Y = 'ymid',
}

export type XNames = XSides | CENTERS.X;
export type YNames = YSides | CENTERS.Y;

export interface I_Corner {
    xName: XSides;
    yName: YSides;
}

export interface I_Center {
    xName: typeof CENTERS.X;
    yName: typeof CENTERS.Y;
}

export type I_Midpoint = {
    xName: XSides;
    yName: CENTERS.Y;
} | {
    xName: CENTERS.X;
    yName: YSides;
}

export const sideMidpoint = (side: SIDES): I_Midpoint => {
    return isXName( side ) ? {
        xName: side,
        yName: CENTERS.Y
    } : {
        xName: CENTERS.X,
        yName: side,
    }
}

export const midpointSide = (point: I_Midpoint): SIDES => {
    return isCenterX( point ) ? point.yName : point.xName;
}

