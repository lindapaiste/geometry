import {ICoordinates, IRectangle} from "./types";
import {IPoint, ISized} from "..";

/**
 * alternative version of rectangle class includes setters for all basic properties (x/y, x1s, width/height)
 * the setters mutate the object itself
 *
 * does not have all of the methods of the ImmutableRectangle class, but it can pass itself to that constructor to
 * access them
 */
export default class MutableRectangle
    implements IPoint, ISized, ICoordinates, IRectangle {
    public x1: number;
    public x2: number;
    public y1: number;
    public y2: number;

    // ----------------------------CREATION--------------------------//

    constructor(width = 0, height = 0, x = 0, y = 0) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y + height;
    }

    // ----------------------------SET VALUES: MOVE--------------------------//

    get x(): number {
        return this.x1;
    }

    /** setting x moves both x1 and x2 while preserving the width
     * @param {number} value
     */
    set x(value: number) {
        this.x2 = value + this.width;
        this.x1 = value;
    }

    get y(): number {
        return this.y1;
    }

    /** setting y moves both y1 and y2 while preserving the height
     * @param {number} value
     */
    set y(value: number) {
        this.y2 = value + this.height;
        this.y1 = value;
    }

    get xmid(): number {
        return this.x + 0.5 * this.width;
    }

    /** setting xmid moves the rectangle along the x axis without changing the size
     * @param {number} value
     */
    set xmid(value: number) {
        this.x = value - 0.5 * this.width;
    }

    get ymid(): number {
        return this.y + 0.5 * this.height;
    }

    /** setting ymid moves the rectangle along the y axis without changing the size
     * @param {number} value
     */
    set ymid(value: number) {
        this.y = value - 0.5 * this.height;
    }

    /**
     * accepts any object with x and y values
     * the point names don't matter, so for example a corner could be set to center
     * will move the rectangle and preserve width/height
     */
    set center(point: IPoint) {
        this.xmid = point.x;
        this.ymid = point.y;
    }

    // ----------------------------SET VALUES: STRETCH--------------------------//

    get width(): number {
        return this.x2 - this.x1;
    }

    /** by default it will expand from the center, changing both x1 and x2
     * to change from another reference point, use setWidth() instead
     * @param {number} value
     */
    set width(value: number) {
        const change = value - this.width;
        this.x1 -= 0.5 * change;
        this.x2 += 0.5 * change;
    }

    get height(): number {
        return this.y2 - this.y1;
    }

    /** by default it will expand from the center, changing both y1 and y2
     * to change from another reference point, use setHeight() instead
     * @param {number} value
     */
    set height(value: number) {
        const change = value - this.height;
        this.y1 -= 0.5 * change;
        this.y2 += 0.5 * change;
    }
}
