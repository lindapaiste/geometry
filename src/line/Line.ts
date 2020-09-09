import {LineDef, LineFormula} from "./types";
import {lineToFormula} from "./convert";
import {Point, XY} from "../coreTypes";
import {slopeToDegrees} from "../angles";
import {shiftPointBy} from "../points";

/**
 * this class is for accessing properties of the line
 * the prop conversion is handled externally
 * Line is immutable
 *
 * what about vertical and horizontal lines which do not include every x and y?
 */
export default class Line implements LineFormula {

    public readonly slope: number;

    public readonly yIntercept: number;

    /**
     * constructor accepts any of the line definitions
     */
    public constructor(props: LineDef) {
        const formula = lineToFormula(props);

        this.slope = formula.slope;
        this.yIntercept = formula.yIntercept;
    }

    /**
     * get the y value for a given x by using formula y = mx + b
     */
    public yForX = (x: number): number => {
        return this.slope * x + this.yIntercept;
    }

    /**
     * get the x value for a given y by using formula x = (y - b)/m
     */
    public xForY = (y: number): number => {
        return (y - this.yIntercept) / this.slope;
    }

    /**
     * get the y value for a given x by using formula y = mx + b
     */
    public pointForX = (x: number): Point => {
        return {x, y: this.yForX(x)};
    }

    /**
     * get the x value for a given y by using formula x = (y - b)/m
     */
    public pointForY = (y: number): Point => {
        return {x: this.xForY(y), y};
    }

    /**
     * find the point of intersection of this line and another line,
     * or return null if they do not intersect
     * or a line if the two lines are identical, as the intersection is infinite
     */
    public intersection = (line: LineDef | Line ): Point | null | Line => {
        const formula = lineToFormula(line);
        if ( this.slope === formula.slope) {
            return ( this.yIntercept === formula.yIntercept) ? this : null;
        }
        const x = (formula.yIntercept - this.yIntercept) / (this.slope - formula.slope);
        const y = this.yForX(x);
        return {x,y};
    }

    /**
     * compare computed y for x with expected y while allowing for slight rounding error
     */
    public contains = (point: Point, margin: number = 0.001): boolean => {
        return Math.abs(this.yForX(point.x) - point.y ) < margin;
    };

    get angle(): number {
        return slopeToDegrees(this.slope);
    }

    /**
     * shift will keep the same slope, but move the y-intercept
     */
    public shift = (value: XY): Line => {
        // can create new line from the current angle and one point, or from two points
        const a = shiftPointBy(this.pointForX(0), value);
        const b = shiftPointBy(this.pointForX(1), value);
        return new Line([a,b]);
    }
}
