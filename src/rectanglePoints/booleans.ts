import {I_PointName} from "./types";
import {CENTERS, I_Center, I_Corner, I_Midpoint, SIDES, XNames, YNames} from "./enums";

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
    return !isCenterX(point) && !isCenterY(point);
}

export const isMidpoint = (point: I_PointName): point is I_Midpoint => {
    //want one but not both sides to be a center
    return (isCenterX(point) || isCenterY(point)) && !isCenter(point);
}

export const isPoint = (point: I_PointName | null | undefined): point is I_PointName => {
    return point !== null && point !== undefined;
}

export const isSamePoint = (a: I_PointName | null | undefined, b: I_PointName | null | undefined): boolean => {
    return isPoint(a) && isPoint(b) && a.xName === b.xName && a.yName === b.yName;
}
