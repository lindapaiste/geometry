import {EitherPoint} from "../points/types";

/**
 * a line can be defined by:
 * - a formula y = mx + b
 * - any two points
 * - a point and an angle (slope)
 */

export interface LineFormula {
    slope: number;
    yIntercept: number;
}

export type LineFromPoints = [EitherPoint, EitherPoint];

export interface LineFromAngle {
    /**
     * angle is in degrees relative to the horizontal axis
     */
    angle: number;
    point: EitherPoint;
}

/**
 * any of the three definitions
 */
export type LineDef = LineFormula | LineFromPoints | LineFromAngle;
