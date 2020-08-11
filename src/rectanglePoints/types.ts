import {XNames, YNames} from "./enums";
import {PointNameTuple} from "./name-tuples";

export interface I_Point {
    x: number,
    y: number,
}

export interface I_RectanglePoint extends I_Point, I_PointName {
    x: number,
    y: number,
    xName: XNames,
    yName: YNames,
}

export interface I_PointName {
    xName: XNames,
    yName: YNames,
}

export interface I_RectanglePointClass extends I_RectanglePoint {
    pointName(): PointNameTuple;

    oppositePointName(): PointNameTuple;

    key: string;
}
