import {IPoint, NumericRange} from "..";
import Line from "./Line";
import {eitherToXY} from "../points/convert";
import {EitherPoint} from "../points/types";
import {ICoordinates} from "..";

/**
 * whereas a Line is infinite, a segment only exists between two defined points
 */
export default class Segment implements ICoordinates {

    public readonly start: IPoint;

    public readonly end: IPoint;

    private line: Line;

    public constructor(start: EitherPoint, end: EitherPoint) {
        this.start = eitherToXY(start);
        this.end = eitherToXY(end);
        this.line = new Line([this.start, this.end]);
    }

    /**
     * start vs end is an arbitrary distinction -- don't make the assumption that start is less than end
     */
    containsX(value: number): boolean {
        return NumericRange.fromNumbers(this.start.x, this.end.x).contains(value);
    }

    containsY(value: number): boolean {
        return NumericRange.fromNumbers(this.start.y, this.end.y).contains(value);
    }

    contains = (point: IPoint, margin?: number): boolean => {
        /**
         * need to know that the point is on the line and that it's not outside of the endpoints
         * checking contains for both x and y would be redundant because the two are linked
         */
        return this.line.contains(point, margin) && this.containsX(point.x);

    };

    /**
     * uses the underlying line, but makes sure that the point is within the segment
     */
    public yForX = (x: number): number | null => {
        return this.containsX(x) ? this.line.yForX(x) : null;
    }

    public xForY = (y: number): number | null => {
        return this.containsY(y) ? this.line.xForY(y) : null;
    }

    get x1() {
        return this.start.x;
    }

    get x2() {
        return this.end.x;
    }

    get y1() {
        return this.start.y;
    }

    get y2() {
        return this.end.y;
    }

}
