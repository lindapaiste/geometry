export interface IPoint {
    x: number;
    y: number;
}

export interface XY extends IPoint {}

export type PointTuple = [number, number];

export type EitherPoint = IPoint | PointTuple;
