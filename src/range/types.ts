import {IPoint} from "..";

/**
 * a range object has a min and a max
 * they are both defined here, but can use Partial<IRange> for open-ended
 */
export interface Range<T = number> {
    min: T;
    max: T;
}

/**
 * define an interface which has the methods of the class
 * make this generic so that both RectangularRange and NumericRange can implement it
 */
export interface RangeMethods<T = number> {
    contains(value: T): boolean;

    constrain(value: T): T;
}

export interface CombinableRange<T = number> {
    hasOverlap(range: Range<T>): boolean;

    intersection(range: Range<T>): Range<T> | null;

    union(range: Range<T>): Range<T> | null;
}

/**
 * a pair of ranges which can be open in any direction
 */
export interface HasRangesXY {
    rangeX: Range;
    rangeY: Range;
}

/**
 * a rectangular range can contain and constrain a point.
 * it can also contain and constrain just an x or a y value
 */
export interface XYRangeMethods extends RangeMethods<IPoint> {
    containsX(value: number): boolean;

    containsY(value: number): boolean;

    constrainX(value: number): number;

    constrainY(value: number): number;
}
