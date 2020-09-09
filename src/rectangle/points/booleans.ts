import {CenterPoint, CornerPoint, IPointName, MidPoint, XName, YName} from "./types";

export const isXName = (name: XName | YName): name is XName => {
    return ["x1", "x2", "xmid"].includes(name);
};

export const isYName = (name: XName | YName): name is XName => {
    return ["y1", "y2", "ymid"].includes(name);
};

export const isCenterX = (point: IPointName): point is IPointName & { xName: "xmid" } => {
    return point.xName === "xmid";
};

export const isCenterY = (point: IPointName): point is IPointName & { yName: "ymid" } => {
    return point.yName === "ymid";
};

export const isCenter = (point: IPointName): point is CenterPoint => {
    return isCenterX(point) && isCenterY(point);
};

export const isCorner = (point: IPointName): point is CornerPoint => {
    return !isCenterX(point) && !isCenterY(point);
};

export const isMidpoint = (point: IPointName): point is MidPoint => {
    // want one but not both sides to be a center
    return (isCenterX(point) || isCenterY(point)) && !isCenter(point);
};

export const isPoint = (point: IPointName | null | undefined): point is IPointName => {
    return point !== null && point !== undefined;
};

export const isSamePointName = (a: IPointName | null | undefined, b: IPointName | null | undefined): boolean => {
    return isPoint(a) && isPoint(b) && a.xName === b.xName && a.yName === b.yName;
};
