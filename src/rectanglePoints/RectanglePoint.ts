import {CENTERS, isXName, SIDES, XNames, YNames} from "./enums";
import {PointNameTuple} from "./name-tuples";
import {I_PointName, I_RectanglePoint, I_RectanglePointClass} from "./types";

/**
 * each point has x and y coordinates and also a name determining where it is on the rectangle
 * the primary purpose of this class is to facilitate getting the name/location of the opposite point
 * but that calculation is all static
 */

export class RectanglePoint implements I_RectanglePoint, I_RectanglePointClass {
    public readonly x: number;
    public readonly y: number;
    public readonly xName: XNames;
    public readonly yName: YNames;

    constructor(props: I_RectanglePoint) {
        this.x = props.x;
        this.y = props.y;
        this.xName = props.xName;
        this.yName = props.yName;
    }

    pointName(): PointNameTuple {
        return [this.xName, this.yName];
    }


    oppositePointName(): PointNameTuple {
        return ([
            RectanglePoint.oppositeXName(this.xName),
            RectanglePoint.oppositeYName(this.yName),
        ])
    };

    get key(): string {
        return this.xName + ',' + this.yName;
    }

    clone(): RectanglePoint {
        return new RectanglePoint(this);
    }

    static oppositeXName(xName: XNames): XNames {
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

    static oppositeYName(yName: YNames): YNames {
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

    static oppositeName(name: XNames | YNames): typeof name {
        return isXName(name)
            ? RectanglePoint.oppositeXName(name)
            : RectanglePoint.oppositeYName(name);
    }

}

export class RectanglePointName implements I_PointName {
    public readonly xName: XNames;
    public readonly yName: YNames;
    public readonly opposite: I_PointName;

    constructor(point: I_PointName) {
        this.xName = point.xName;
        this.yName = point.yName;
        this.opposite = getOppositeName(point);
    }
}

export const getOppositeName = (point: I_PointName): I_PointName => {
    return {
        xName: RectanglePoint.oppositeXName(point.xName),
        yName: RectanglePoint.oppositeYName(point.yName),
    }
}

export default RectanglePoint;
