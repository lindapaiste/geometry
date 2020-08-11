import {I_Coordinates, I_Rectangle} from "./types";
import {I_Point} from "../rectanglePoints/types";
import {I_Sized} from "../sized/types";

/**
 * alternative version of rectangle class includes setters for all basic properties (x/y, x1s, width/height)
 * the setters mutate the object itself
 *
 * does not have all of the methods of the ImmutableRectangle class, but it can pass itself to that constructor to
 * access them
 */
export default class MutableRectangle implements I_Point, I_Sized, I_Coordinates, I_Rectangle {

    public x1: number;
    public x2: number;
    public y1: number;
    public y2: number;

//----------------------------CREATION--------------------------//

    constructor(width = 0, height = 0, x = 0, y = 0) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y + height;
    }

//----------------------------SET VALUES: MOVE--------------------------//

    /** setting x moves both x1 and x2 while preserving the width
     * @param {number} value
     */
    set x(value: number) {
        this.x2 = value + this.width;
        this.x1 = value;
    }

    /** setting y moves both y1 and y2 while preserving the height
     * @param {number} value
     */
    set y(value: number) {
        this.y2 = value + this.height;
        this.y1 = value;
    }

    /** setting xmid moves the rectangle along the x axis without changing the size
     * @param {number} value
     */
    set xmid(value: number) {
        this.x = value - .5 * this.width;
    }

    /** setting ymid moves the rectangle along the y axis without changing the size
     * @param {number} value
     */
    set ymid(value: number) {
        this.y = value - .5 * this.height;
    }

    /**
     * accepts any object with x and y values
     * the point names don't matter, so for example a corner could be set to center
     * will move the rectangle and preserve width/height
     */
    set center(point: I_Point) {
        this.xmid = point.x;
        this.ymid = point.y;
    }

//----------------------------SET VALUES: STRETCH--------------------------//

    /** by default it will expand from the center, changing both x1 and x2
     * to change from another reference point, use setWidth() instead
     * @param {number} value
     */
    set width(value: number) {
        const change = value - this.width;
        this.x1 -= .5 * change;
        this.x2 += .5 * change;
    }

    /** by default it will expand from the center, changing both y1 and y2
     * to change from another reference point, use setHeight() instead
     * @param {number} value
     */
    set height(value: number) {
        const change = value - this.height;
        this.y1 -= .5 * change;
        this.y2 += .5 * change;
    }

//----------------------------GET ALIASED & COMPUTED VALUES--------------------------//

    get x(): number {
        return this.x1;
    }

    get y(): number {
        return this.y1;
    }

    get width(): number {
        return this.x2 - this.x1;
    }

    get height(): number {
        return this.y2 - this.y1;
    }

    get xmid(): number {
        return this.x + .5 * this.width;
    }

    get ymid(): number {
        return this.y + .5 * this.height;
    }

}

