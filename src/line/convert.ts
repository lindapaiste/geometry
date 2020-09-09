import {LineDef, LineFormula, LineFromAngle, LineFromPoints} from "./types";
import {degreesToRadians} from "../angles";
import {pointToXY} from "../points";
import {EitherPoint} from "../coreTypes";

/**
 * find which definition we are dealing with
 */
export const isPoints = (line: LineDef): line is LineFromPoints => Array.isArray(line);

export const isFormula = (line: LineDef): line is LineFormula => "slope" in line && "yIntercept" in line;

export const isAngle = (line: LineDef): line is LineFromAngle => "angle" in line && "point" in line;

/**
 * convert any type of line definition into a formula which the Line class can understand
 */
export const lineToFormula = (line: LineDef): LineFormula => {
    if (isPoints(line)) {
        return pointsToFormula(line);
    } else if (isAngle(line)) {
        return angleToFormula(line);
    } else if (isFormula(line)) {
        return line;
    } else {
        throw new Error("cannot convert line definition");
    }
}

export const pointsToFormula = (endpoints: LineFromPoints): LineFormula => {
    const a = pointToXY(endpoints[0]);
    const b = pointToXY(endpoints[1]);
    /**
     * slope is rise over run
     */
    const slope = (b.y - a.y) / (b.x - a.x);
    /**
     * can plug either a or b into the formula, but the result should be the same
     */
    const yIntercept = a.y - slope * a.x;

    return {
        slope,
        yIntercept,
    }
}

export const angleToFormula = ({angle, point}: LineFromAngle): LineFormula => {
    /**
     * slope is the tangent of the angle in radians
     */
    const slope = Math.tan(degreesToRadians(angle));
    const yIntercept = findYIntercept(slope, point);

    return {
        slope,
        yIntercept
    }
}

/**
 * rearrange the y = mx + b formula to b = y - mx to get b from a slope and a point
 */
export const findYIntercept = (slope: number, point: EitherPoint): number => {
    const {x, y} = pointToXY(point);
    return y - slope * x;
}
