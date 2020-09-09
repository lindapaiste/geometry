import {CombinableRange, RangeMethods} from "./types";
import {fixPartialRange, numbersToRange} from "./convert";
import {PropLength, Range} from "../coreTypes";

/**
 * a numeric range can be open-ended on one or both ends, but the min and max will always be a number because it will
 * be positive or negative Infinity instead of undefined
 */
export default class NumericRange implements Range, RangeMethods, CombinableRange, PropLength {
    public readonly max: number;
    public readonly min: number;

    /**
     * a Range can be open on either or both ends
     * both min and max can be a number or undefined for an open-ended range
     *
     * @param {number} [min] -- the range minimum
     * @param {number} [max] -- the range maximum
     */
    constructor(min: number = -Infinity, max: number = Infinity) {
        this.min = min;
        this.max = max;
    }

    /**
     * convert a min and max object into a numeric range class
     */
    public static fromRange({min, max}: Partial<Range>): NumericRange {
        return new NumericRange(min, max);
    }

    /**
     * constructor needs to take min and max in order if either of them are to be undefined.  But if both numbers are
     * known, can pass in any order and know which is the min and the max by comparing them.  Can also accept more than
     * two numbers, and any in the middle are simply ignored.
     */
    public static fromNumbers(...numbers: number[]): NumericRange {
        return NumericRange.fromRange(numbersToRange(...numbers));
    }

    /**
     * true if the range min is a finite number, aka not -Infinity, Infinity, or NaN
     */
    hasMin(): this is this & { min: number } {
        return isFinite(this.min);
    }

    /**
     * true if the range max is a finite number
     */
    hasMax(): this is this & { max: number } {
        return isFinite(this.max);
    }

    /**
     * true if both the min and max are finite numbers
     */
    isFinite(): this is this & Range {
        return this.hasMin() && this.hasMax();
    }

    /**
     * length is the distance between the max and min if both are defined, or infinity otherwise
     */
    get length(): number {
        return this.max - this.min;
    }

    /**
     * boolean of whether the given number is inside the range, including the endpoints
     */
    contains(value: number): boolean {
        return !(this.isTooLarge(value) || this.isTooSmall(value));
    }

    /**
     * boolean of whether the given number is too large to fit inside the range
     */
    isTooLarge(value: number): boolean {
        return value > this.max;
    }

    /**
     * boolean of whether the given number is too small to fit inside the range
     */
    isTooSmall(value: number): boolean {
        return value < this.min;
    }

    /**
     * force values that are outside the range into the nearest edge
     */
    constrain(value: number): number {
        value = Math.max(value, this.min);
        return Math.min(value, this.max);
    }

    /**
     * helper for union and intersection, determines whether there is any overlap between the ranges
     */
    hasOverlap(range: Partial<Range>): boolean {
        // no overlap when this.max < range.min or this.min > range.max
        const {min, max} = fixPartialRange(range);
        return !(this.max < min || this.min > max);
    }

    /**
     * returns a new Range representing the intersection of the given the range and the current range
     * or null if there is no overlap
     */
    intersection(range: Partial<Range>): NumericRange | null {
        if (!this.hasOverlap(range)) return null;
        const {min, max} = fixPartialRange(range);
        return new NumericRange(this.constrain(min), this.constrain(max));
    }

    /**
     * returns a new Range representing the union of the given the range and the current range
     * or null if the ranges do not overlap
     */
    union(range: Partial<Range>): NumericRange | null {
        if (!this.hasOverlap(range)) return null;
        const {min, max} = fixPartialRange(range);
        return new NumericRange(Math.min(min, this.min), Math.max(max, this.max));
    }
}

export const toNumericRange = (obj: Partial<Range>): NumericRange => {
    return obj instanceof NumericRange ? obj : NumericRange.fromRange(obj);
}
