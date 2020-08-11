import {XNames, YNames} from "./enums";
import {PointNameTuple} from "./name-tuples";

export interface IPoint {
    x: number,
    y: number,
}

export interface IRectanglePoint extends IPoint, IPointName {
    x: number,
    y: number,
    xName: XNames,
    yName: YNames,
}

export interface IPointName {
    xName: XNames,
    yName: YNames,
}

export interface IRectanglePointClass extends IRectanglePoint {
    pointName(): PointNameTuple;

    oppositePointName(): PointNameTuple;

    key: string;
}
