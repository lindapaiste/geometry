export interface IPoint {
    x: number;
    y: number;
}

export type PointTuple = [number, number];

export type EitherPoint = IPoint | PointTuple;
