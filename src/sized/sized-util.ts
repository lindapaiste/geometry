import {I_Sized, PropHeight, PropWidth} from "./types";
import {ScaledObjectCreator} from "../scaling/ScaledVersion";


export const getAspectRatio = (obj: I_Sized): number | undefined =>
    (obj.height === 0) ? undefined : obj.width / obj.height;

/**
 * need to allow some margin of error when comparing aspect ratios to account for rounding
 */
export const isAspectRatio = (ratio: number, maxPixelDiff: number = 1) => (obj: I_Sized): boolean => {
    const expectedHeight = obj.width / ratio;
    const difference = expectedHeight - obj.height;
    return Math.abs(difference) <= maxPixelDiff;
};

/**
 * creates a sized object where height = 1 and width = some fraction which is the aspect ratio
 * can then scale this object to any desired size
 */
export const ratioAsObject = (ratio: number): I_Sized => ({
    width: ratio,
    height: 1,
});

export const area = (obj: I_Sized): number =>
    obj.width * obj.height;

/**
 * returns the larger of the two, based on area
 * will return the first if both are equal
 */
export const returnLarger = <T extends I_Sized>(a: T, b: T): T =>
    area(a) >= area(b) ? a : b;

export const returnSmaller = <T extends I_Sized>(a: T, b: T): T =>
    area(a) <= area(b) ? a : b;


/**
 * the object's width and height must both be SMALLER than the target
 * if target dimension is undefined, it is presumed ok
 */
export const fits = (target: Partial<I_Sized>) => (object: I_Sized): boolean => {
    return (target.height === undefined ? true : target.height >= object.height)
        && (target.width === undefined ? true : target.width >= object.width);
}

/**
 * the object's width and height must both be LARGER than the target
 * A covers B is the same as B fits A
 */
export const covers = (target: Partial<I_Sized>) => (object: I_Sized): boolean => {
    return object.width >= (target.width || 0)
        && object.height >= (target.height || 0);
}

/**
 * used for filtering sizes to object-fit: "contain"
 * the object needs to have EITHER the height or the width is larger than the target
 * use a special check because if only one dimension is defined, want to exceed that dimension
 * not just exceed the undefined one
 * but isn't this just the opposite of fits?
 */
export const exceedsEither = (target: Partial<I_Sized>) => (object: I_Sized): boolean => {
    return ! fits(target)(object);
    /*
    (target.width ? size.width >= target.width : false)
                || (target.height ? size.height >= target.height : false)
     */
}

/*
export const isTallerThan = (current: PropHeight, compareTo: PropHeight): boolean =>
    current.height > compareTo.height;

export const isWiderThan = (current: PropWidth, compareTo: PropWidth): boolean =>
    current.width > compareTo.width;


export const isLargerThan = (current: Sized, compareTo: Sized): boolean =>
    isTallerThan(current, compareTo) && isWiderThan(current, compareTo); //needs to include equal
*/

export const heightDiff = (a: PropHeight, b: PropHeight): number =>
    a.height - b.height;

export const widthDiff = (a: PropWidth, b: PropWidth): number =>
    a.width - b.width;

/**
 * if fitting a 500 x 500 image to a 300 x 400 area, the displayed size is 300 x 300
 * will have the aspect ratio of the object
 */
export const fitDisplayedSize = (target: I_Sized) => (object: I_Sized): I_Sized => {
    const creator = new ScaledObjectCreator(object);
    return creator.scaleToFit(target);
};
