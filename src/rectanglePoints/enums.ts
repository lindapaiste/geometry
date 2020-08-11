/**
 * Enum for rectangle side names
 * @readonly
 * @enum {string}
 */
import {I_PointName} from "./types";

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

const XNAMES = [SIDES.LEFT, SIDES.RIGHT, CENTERS.X];

const YNAMES = [SIDES.TOP, SIDES.BOTTOM, CENTERS.Y];

export const isXName = (name: XNames | YNames): name is XNames => {
    return XNAMES.includes(name);
}

export const isYName = (name: XNames | YNames): name is XNames => {
    return YNAMES.includes(name);
}

export const isCenterX = (point: I_PointName): point is I_PointName & { xName: typeof CENTERS.X } => {
    return point.xName === CENTERS.X
}

export const isCenterY = (point: I_PointName): point is I_PointName & { yName: typeof CENTERS.Y } => {
    return point.yName === CENTERS.Y
}

export const isCenter = (point: I_PointName): point is I_Center => {
    return isCenterX(point) && isCenterY(point);
}

export const isCorner = (point: I_PointName): point is I_Corner => {
    return ! isCenterX(point) && ! isCenterY(point);
}

export const isMidpoint = (point: I_PointName): point is I_Midpoint => {
    //want one but not both sides to be a center
    return (isCenterX(point) || isCenterY(point)) && ! isCenter(point);
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

export const isPoint = (point: I_PointName | null | undefined): point is I_PointName => {
    return point !== null && point !== undefined;
}

export const isSamePoint = (a: I_PointName | null | undefined, b: I_PointName | null | undefined ): boolean => {
    return isPoint(a) && isPoint(b) && a.xName === b.xName && a.yName === b.yName;
}
