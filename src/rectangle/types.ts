import { IPoint, ISized } from "..";

export interface ICoordinates {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface IRectangle extends ISized, IPoint {
  x: number;
  y: number;
  width: number;
  height: number;
}
