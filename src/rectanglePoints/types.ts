import {IPoint} from "..";

export type XSide = "x1" | "x2";
export type YSide = "y1" | "y2";
export type Side = XSide | YSide;
export type XCenter = "xmid";
export type YCenter = "ymid";
export type XName = XSide | XCenter;
export type YName = YSide | YCenter;

// -----------------------SPECIFIC POINT NAMES----------------------- //

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

// -----------------------GENERAL POINT NAME----------------------- //

export interface IPointName {
  xName: XName;
  yName: YName;
}

export type PointNameTuple = [XName, YName];

// -----------------------POINT = NAMES + VALUES ----------------------- //

export interface IRectanglePoint extends IPoint, IPointName {
  x: number;
  y: number;
  xName: XName;
  yName: YName;
}
