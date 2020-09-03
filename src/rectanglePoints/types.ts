import {IPoint} from "..";

/**
 * specific point types
 * phasing out enums in favor of typed strings
 */

export type XSide = "x1" | "x2";
export type YSide = "y1" | "y2";
export type Side = XSide | YSide;
export type XCenter = "xmid";
export type YCenter = "ymid";
export type XName = XSide | XCenter;
export type YName = YSide | YCenter;

export interface CornerPoint {
  xName: XSide;
  yName: YSide;
}

export interface CenterPoint {
  xName: XCenter;
  yName: YCenter;
}

export type MidPoint =
    | {
  xName: XSide;
  yName: YCenter;
}
    | {
  xName: XCenter;
  yName: YSide;
};

export interface IPointName {
  xName: XName;
  yName: YName;
}

export interface IRectanglePoint extends IPoint, IPointName {
  x: number;
  y: number;
  xName: XName;
  yName: YName;
}


export type PointNameTuple = [XName, YName];

export interface IRectanglePointClass extends IRectanglePoint {
  pointName(): PointNameTuple;

  oppositePointName(): PointNameTuple;

  key: string;
}
