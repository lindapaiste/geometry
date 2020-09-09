import {Coordinates, Range, XY} from "../coreTypes";

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

/**
 * returns true if the coordinates have a negative width or height
 */
export const isInvertedCoords = ({x1, x2, y1, y2}: Coordinates) => {
    return x1 > x2 || y1 > y2;
}
