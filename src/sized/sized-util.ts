import { ISized, PropHeight, PropWidth } from "./types";

export const getAspectRatio = (obj: ISized): number | undefined =>
  obj.height === 0 ? undefined : obj.width / obj.height;

/**
 * need to allow some margin of error when comparing aspect ratios to account for rounding
 */
export const isAspectRatio = (ratio: number, maxPixelDiff: number = 1) => (
  obj: ISized
): boolean => {
  const expectedHeight = obj.width / ratio;
  const difference = expectedHeight - obj.height;
  return Math.abs(difference) <= maxPixelDiff;
};

/**
 * creates a sized object where height = 1 and width = some fraction which is the aspect ratio
 * can then scale this object to any desired size
 */
export const ratioAsObject = (ratio: number): ISized => ({
  width: ratio,
  height: 1,
});

export const area = (obj: ISized): number => obj.width * obj.height;

/**
 * returns the larger of the two, based on area
 * will return the first if both are equal
 */
export const returnLarger = <T extends ISized>(a: T, b: T): T =>
  area(a) >= area(b) ? a : b;

export const returnSmaller = <T extends ISized>(a: T, b: T): T =>
  area(a) <= area(b) ? a : b;

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
export const covers = (target: Partial<ISized>) => (
  object: ISized
): boolean => {
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
export const exceedsEither = (target: Partial<ISized>) => (
  object: ISized
): boolean => {
  return !fits(target)(object);
  /*
    (target.width ? size.width >= target.width : false)
                || (target.height ? size.height >= target.height : false)
     */
};

/*
export const isTallerThan = (current: PropHeight, compareTo: PropHeight): boolean =>
    current.height > compareTo.height;

export const isWiderThan = (current: PropWidth, compareTo: PropWidth): boolean =>
    current.width > compareTo.width;


export const isLargerThan = (current: Sized, compareTo: Sized): boolean =>
    isTallerThan(current, compareTo) && isWiderThan(current, compareTo); // needs to include equal
*/

export const heightDiff = (a: PropHeight, b: PropHeight): number =>
  a.height - b.height;

export const widthDiff = (a: PropWidth, b: PropWidth): number =>
  a.width - b.width;
