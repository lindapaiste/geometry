import {ISized, PropHeight, PropWidth} from "./types";

// ----------------------COMPUTED PROPERTIES-------------------------- //

/**
 * any sized object has an aspect ratio
 * will be Infinity if height is 0
 */
export const getAspectRatio = (obj: ISized): number => obj.width / obj.height;

export const getArea = (obj: ISized): number => obj.width * obj.height;

/**
 * creates a sized object where height = 1 and width = some fraction which is the aspect ratio
 * can then scale this object to any desired size
 */
export const ratioAsObject = (ratio: number): ISized => ({
    width: ratio,
    height: 1,
});

// ----------------------ARRAY REDUCE-------------------------- //

/**
 * For use in array reduce.
 * Returns the larger of the two, based on area. Will return the first if both are equal.
 */
export const returnLarger = <T extends ISized>(a: T, b: T): T =>
    getArea(a) >= getArea(b) ? a : b;

export const returnSmaller = <T extends ISized>(a: T, b: T): T =>
    getArea(a) <= getArea(b) ? a : b;

// ----------------------ARRAY FILTERS-------------------------- //

/**
 * need to allow some margin of error when comparing aspect ratios to account for rounding
 */
export const isAspectRatio = (ratio: number, maxPixelDiff: number = 1) => (obj: ISized): boolean => {
    const expectedHeight = obj.width / ratio;
    return isSameValue(expectedHeight, obj.height, maxPixelDiff);
};

/**
 * the object's width and height must both be SMALLER than the target
 * if target dimension is undefined, it is presumed ok
 */
export const fits = (target: Partial<ISized>) => (object: ISized): boolean => {
    return (
        (target.height === undefined ? true : target.height >= object.height) &&
        (target.width === undefined ? true : target.width >= object.width)
    );
};

/**
 * the object's width and height must both be LARGER than the target
 * A covers B is the same as B fits A
 */
export const covers = (target: Partial<ISized>) => (object: ISized): boolean => {
    return (
        object.width >= (target.width || 0) && object.height >= (target.height || 0)
    );
};

/**
 * used for filtering sizes to object-fit: "contain"
 * the object needs to have EITHER the height or the width is larger than the target
 * use a special check because if only one dimension is defined, want to exceed that dimension
 * not just exceed the undefined one
 * but isn't this just the opposite of fits?
 */
export const exceedsEither = (target: Partial<ISized>) => (object: ISized): boolean => {
    return !fits(target)(object);
    /*
      (target.width ? size.width >= target.width : false)
                  || (target.height ? size.height >= target.height : false)
       */
};

// ----------------------ERROR MARGIN HELPERS-------------------------- //

/**
 * allows for either a or b to be undefined, but will return false is either or both are not defined numbers
 */
export const isSameValue = (a?: number, b?: number, margin: number = 0) => {
    return a !== undefined && b !== undefined && isSameNumber(a, b, margin);
}

export const isSameNumber = (a: number, b: number, margin: number = 0) => {
    return Math.abs(b - a) <= margin;
}

export const isWithinMargin = (value: number, margin: number) => {
    return Math.abs(value) <= margin;
}

// ----------------------COMPARE TWO SIZED OBJECTS-------------------------- //

export const widthDiff = (a: PropWidth, b: PropWidth): number =>
    a.width - b.width;

export const heightDiff = (a: PropHeight, b: PropHeight): number =>
    a.height - b.height;


export const isSameWidth = (a: PropWidth, b: PropWidth, margin: number = .01): boolean => {
    return isWithinMargin(widthDiff(a, b), margin);
}

export const isSameHeight = (a: PropHeight, b: PropHeight, margin: number = .01): boolean => {
    return isWithinMargin(heightDiff(a, b), margin);
}

export const isSameSize = (a: ISized, b: ISized, margin: number = .01): boolean => {
    return isSameWidth(a, b, margin) && isSameHeight(a, b, margin);
}

export const isSameAspectRatio = (a: ISized, b: ISized, margin?: number): boolean => {
    const ratio = getAspectRatio(a);
    const pixelDiff = margin === undefined ? undefined : margin * a.width;
    return isAspectRatio(ratio, pixelDiff)(b);
}

/*
export const isTaller = (current: PropHeight, compareTo: PropHeight): boolean =>
    current.height > compareTo.height;

export const isWider = (current: PropWidth, compareTo: PropWidth): boolean =>
    current.width > compareTo.width;


export const isLargerArea = (current: Sized, compareTo: Sized): boolean =>
    isTallerThan(current, compareTo) && isWiderThan(current, compareTo); // needs to include equal
*/

// ----------------------SHAPE BOOLEANS-------------------------- //

/**
 * true if the rectangle is wider than it is tall
 */
const isHorizontal = (obj: ISized): boolean => {
    return obj.height < obj.width;
}

/**
 * true if the rectangle is taller than it is wide
 */
const isVertical = (obj: ISized): boolean => {
    return obj.height > obj.width;
}

/**
 * true if the two sides are equal within a margin
 */
const isSquare = (obj: ISized, margin: number = .01): boolean => {
    return isSameValue(obj.height, obj.width, margin);
}
