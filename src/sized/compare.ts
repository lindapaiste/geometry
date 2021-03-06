import {PropHeight, PropWidth, Sized} from "../coreTypes";
import {getArea, getAspectRatio, isAspectRatio} from "./compute";
import {isSameNumber} from "../isSameValue";


// ----------------------ARRAY REDUCE-------------------------- //

/**
 * For use in array reduce.
 * Returns the larger of the two, based on area. Will return the first if both are equal.
 */
export const returnLarger = <T extends Sized>(a: T, b: T): T =>
    getArea(a) >= getArea(b) ? a : b;

export const returnSmaller = <T extends Sized>(a: T, b: T): T =>
    getArea(a) <= getArea(b) ? a : b;

// ----------------------ARRAY FILTERS-------------------------- //

/**
 * the object's width and height must both be SMALLER than the target
 * if target dimension is undefined, it is presumed ok
 */
export const fits = (target: Partial<Sized>) => (object: Sized): boolean => {
    return (
        (target.height === undefined ? true : target.height >= object.height) &&
        (target.width === undefined ? true : target.width >= object.width)
    );
};

/**
 * the object's width and height must both be LARGER than the target
 * A covers B is the same as B fits A
 */
export const covers = (target: Partial<Sized>) => (object: Sized): boolean => {
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
export const exceedsEither = (target: Partial<Sized>) => (object: Sized): boolean => {
    return !fits(target)(object);
    /*
      (target.width ? size.width >= target.width : false)
                  || (target.height ? size.height >= target.height : false)
       */
};

// ----------------------COMPARE TWO SIZED OBJECTS-------------------------- //

export const widthDiff = (a: PropWidth, b: PropWidth): number =>
    a.width - b.width;

export const heightDiff = (a: PropHeight, b: PropHeight): number =>
    a.height - b.height;


export const isSameWidth = (a: PropWidth, b: PropWidth, margin: number = .01): boolean => {
    return isSameNumber(a.width, b.width, margin);
}

export const isSameHeight = (a: PropHeight, b: PropHeight, margin: number = .01): boolean => {
    return isSameNumber(a.height, b.height, margin);
}

export const isSameSize = (a: Sized, b: Sized, margin: number = .01): boolean => {
    return isSameWidth(a, b, margin) && isSameHeight(a, b, margin);
}

export const isSameArea = (a: Sized, b: Sized, margin: number = .01): boolean => {
    return isSameNumber(getArea(a), getArea(b), margin);
}

export const isSameAspectRatio = (a: Sized, b: Sized, margin?: number): boolean => {
    const ratio = getAspectRatio(a);
    const pixelDiff = margin === undefined ? undefined : margin * a.width;
    return isAspectRatio(ratio, pixelDiff)(b);
}

/*
export const isTaller = (current: PropHeight, compareTo: PropHeight): boolean =>
    current.height > compareTo.height;

export const isWider = (current: PropWidth, compareTo: PropWidth): boolean =>
    current.width > compareTo.width;
*/

