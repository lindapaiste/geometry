import {
  covers,
  returnLarger,
  returnSmaller,
} from "./compare";
import {Sized} from "../coreTypes";
import {isAspectRatio} from "./compute";

// functions which act upon an array of Sized objects //

/**
 * filter an array of sizes to only those that match the given aspect ratio
 */
export const getAspectRatioSizes = (objects: Sized[], ratio: number): Sized[] => {
  return objects.filter(isAspectRatio(ratio));
};
/**
 * gets the largest object in the array, based on area
 */
export const getLargestSize = (objects: Sized[]): Sized => {
  return objects.reduce(returnLarger);
};
export const getSmallestSize = (objects: Sized[]): Sized => {
  return objects.reduce(returnSmaller);
};
/**
 * gets the smallest size which is larger than the provided width
 */
export const getWidthSize = (objects: Sized[], width: number): Sized => {
  const larger = objects.filter((o) => o.width >= width);
  return getSmallestSize(larger);
};
/**
 * aspect ratio does not matter
 * want the smallest size which is large enough to cover the target on both dimensions
 */
export const getCoverSize = (objects: Sized[], target: Sized): Sized => {
  return getSmallestSize(objects.filter(covers(target)));
};
