import {LineDef, LineFormula} from "./types";
import {lineToFormula} from "./convert";
import {IPoint, IRectangle} from "..";

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
    public pointForX = (x: number): IPoint => {
        return {x, y: this.yForX(x)};
    }

    /**
     * get the x value for a given y by using formula x = (y - b)/m
     */
    public pointForY = (y: number): IPoint => {
        return {x: this.xForY(y), y};
    }

    /**
     * find the point of intersection of this line and another line,
     * or return null if they do not intersect
     * or a line if the two lines are identical, as the intersection is infinite
     */
    public intersection = (line: LineDef | Line ): IPoint | null | Line => {
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
    contains = (point: IPoint, margin: number = 0.001): boolean => {
        return Math.abs(this.yForX(point.x) - point.y ) < margin;
    };
}
