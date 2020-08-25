import {XNames, YNames} from "./enums";
import {PointNameTuple} from "./name-tuples";
import {IPoint} from "..";

export interface IRectanglePoint extends IPoint, IPointName {
  x: number;
  y: number;
  xName: XNames;
  yName: YNames;
}

export interface IPointName {
  xName: XNames;
  yName: YNames;
}

export interface IRectanglePointClass extends IRectanglePoint {
  pointName(): PointNameTuple;

  oppositePointName(): PointNameTuple;

  key: string;
}
