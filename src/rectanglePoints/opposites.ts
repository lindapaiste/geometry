import {IPointName} from "./types";
import {CENTERS, SIDES, XNames, YNames} from "./enums";
import {isXName} from "./booleans";

export const oppositeXName = (xName: XNames): XNames => {
    switch (xName) {
        case SIDES.LEFT:
            return SIDES.RIGHT;
        case SIDES.RIGHT:
            return SIDES.LEFT;
        case CENTERS.X:
        default:
            return xName;
    }
}

export const oppositeYName = (yName: YNames): YNames => {
    switch (yName) {
        case SIDES.TOP:
            return SIDES.BOTTOM;
        case SIDES.BOTTOM:
            return SIDES.TOP;
        case CENTERS.Y:
        default:
            return yName;
    }
}

export const oppositeName = (name: XNames | YNames): typeof name => {
    return isXName(name)
        ? oppositeXName(name)
        : oppositeYName(name);
}

export const oppositePointName = (point: IPointName): IPointName => {
    return {
        xName: oppositeXName(point.xName),
        yName: oppositeYName(point.yName),
    }
}
