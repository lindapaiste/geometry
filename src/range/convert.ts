import {XYRange} from "./index";
import {Range, Coordinates, XY} from "../coreTypes";

/**
 * helper method allows accepting partially defined ranges as props by replacing undefined with infinite
 */
export const fixPartialRange = (range: Partial<Range>): Range => {
    const {min = -Infinity, max = Infinity} = range;
    return {min, max};
}

/**
 * extract the min and max from any number of numbers
 * if only one number is present, min and max will be the same
 * if zero numbers are present, will give a nonsensical result because Math.max() is -Infinity while Math.min is
 * positive Infinity
 */
export const numbersToRange = (...numbers: number[]): Range => {
    return {
        min: Math.min(...numbers),
        max: Math.max(...numbers)
    }
}

/**
 * helper for combine methods, enforces that the object implementing Range<XY> is an XYRange
 *
 * interface Range<XY> has a min and max which are each XY or undefined
 * want to convert to separate rangeX and rangeY
 */
export const toXYRange = (range: Range<XY>): XYRange => {
    if (range instanceof XYRange) {
        return range;
    } else {
        return new XYRange(rangeXYtoCoords(range));
    }
}

export const rangeXYtoCoords = (range: Range<XY>): Coordinates => {
    const {min, max} = range;
    // could double check min/max
    return {
        x1: min.x,
        x2: max.x,
        y1: min.y,
        y2: max.y
    }
}
