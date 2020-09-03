import {IPointName, XCenter, XName, XSide, YCenter, YName, YSide} from "./types";
import {isXName} from "./booleans";

// note: could use string manipulation here to combine logic between x and y, but would lose the type inference

export const oppositeXName = (xName: XSide | XCenter): XName & typeof xName => {
    switch (xName) {
        case "x1":
            return "x2";
        case "x2":
            return "x1";
        case "xmid":
        default:
            return xName;
    }
};

export const oppositeYName = (yName: YSide | YCenter): YName & typeof yName => {
    switch (yName) {
        case "y1":
            return "y2";
        case "y2":
            return "y1";
        case "ymid":
        default:
            return yName;
    }
};

export const oppositeName = (name: XName | YName): typeof name => {
    return isXName(name) ? oppositeXName(name) : oppositeYName(name);
};

export const oppositePointName = (point: IPointName): IPointName => {
    return {
        xName: oppositeXName(point.xName),
        yName: oppositeYName(point.yName),
    };
};
