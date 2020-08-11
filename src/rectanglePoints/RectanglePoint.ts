import {XNames, YNames} from "./enums";
import {PointNameTuple} from "./name-tuples";
import {I_PointName, I_RectanglePoint, I_RectanglePointClass} from "./types";
import {oppositePointName} from "./opposites";

/**
 * each point has x and y coordinates and also a name determining where it is on the rectangle
 * the primary purpose of this class is to facilitate getting the name/location of the opposite point
 * but that calculation is all static
 */

export default class RectanglePoint implements I_RectanglePoint, I_RectanglePointClass {
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
        const opp = oppositePointName(this);
        return [opp.xName, opp.yName];
    };

    get key(): string {
        return this.xName + ',' + this.yName;
    }

    clone(): RectanglePoint {
        return new RectanglePoint(this);
    }

}

export class RectanglePointName implements I_PointName {
    public readonly xName: XNames;
    public readonly yName: YNames;
    public readonly opposite: I_PointName;

    constructor(point: I_PointName) {
        this.xName = point.xName;
        this.yName = point.yName;
        this.opposite = oppositePointName(point);
    }
}

