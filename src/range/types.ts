import {I_Point} from "../rectanglePoints/types";

/**
 * a range object has a min and a max
 * they are both defined here, but can use Partial<I_Range> for open-ended
 */
export interface I_Range {
    min: number;
    max: number;
}

/**
 * define an interface which has the methods of the class
 * make this generic so that both RectangularRange and NumericRange can implement it
 */
export interface I_RangeMethods<T> {
    contains(value: T): boolean;

    constrain(value: T): T;
}

/**
 * includes methods which are in the NumericRange class but not XYRange
 */
export interface I_NumericRange extends I_RangeMethods<number>, Partial<I_Range> {
    hasMin(): this is this & { min: number };

    hasMax(): this is this & { max: number };

    isDefined(): this is this & I_Range;

    isTooLarge(value: number): boolean;

    isTooSmall(value: number): boolean;

    hasOverlap(range: I_NumericRange): boolean;

    intersection(range: I_NumericRange): I_NumericRange | null;

    union(range: I_NumericRange): I_NumericRange | null;
}

/**
 * a pair of ranges which are both defined
 */
export interface I_DefinedXYRange {
    rangeX: I_Range;
    rangeY: I_Range;
}

/**
 * a pair of ranges which can be open in any direction
 */
export interface I_XYRange {
    rangeX: Partial<I_Range>;
    rangeY: Partial<I_Range>;
}

/**
 * a rectangular range can contain and constrain a point.
 * it can also contain and constrain just an x or a y value
 */
export interface I_XYRangeMethods extends I_RangeMethods<I_Point> {
    containsX(value: number): boolean;

    containsY(value: number): boolean;

    constrainX(value: number): number;

    constrainY(value: number): number;
}
