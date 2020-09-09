import {Sized} from "../coreTypes";
import {isSameValue} from "../isSameValue";


// ----------------------DERIVED PROPERTIES-------------------------- //

/**
 * any sized object has an aspect ratio
 * will be Infinity if height is 0
 */
export const getAspectRatio = (obj: Sized): number => obj.width / obj.height;

export const getArea = (obj: Sized): number => obj.width * obj.height;
/**
 * creates a sized object where height = 1 and width = some fraction which is the aspect ratio
 * can then scale this object to any desired size
 */
export const ratioAsObject = (ratio: number): Sized => ({
    width: ratio,
    height: 1,
});

// ----------------------SHAPE BOOLEANS-------------------------- //

/**
 * true if the rectangle is wider than it is tall
 */
const isHorizontal = (obj: Sized): boolean => {
    return obj.height < obj.width;
}
/**
 * true if the rectangle is taller than it is wide
 */
const isVertical = (obj: Sized): boolean => {
    return obj.height > obj.width;
}
/**
 * true if the two sides are equal within a margin
 */
const isSquare = (obj: Sized, margin: number = .01): boolean => {
    return isSameValue(obj.height, obj.width, margin);
}

/**
 * need to allow some margin of error when comparing aspect ratios to account for rounding
 */
export const isAspectRatio = (ratio: number, maxPixelDiff: number = 1) => (obj: Sized): boolean => {
    const expectedHeight = obj.width / ratio;
    return isSameValue(expectedHeight, obj.height, maxPixelDiff);
};
