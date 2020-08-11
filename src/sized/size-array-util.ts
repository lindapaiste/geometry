import {ISized} from "./types";
import {covers, isAspectRatio, returnLarger, returnSmaller} from "./sized-util";

// functions which act upon an array of Sized objects //


/**
 * filter an array of sizes to only those that match the given aspect ratio
 */
export const getAspectRatioSizes = (objects: ISized[], ratio: number): ISized[] => {
    // return objects.filter( obj => getAspectRatio(obj) === ratio);
    return objects.filter(isAspectRatio(ratio));
};
/**
 * gets the largest object in the array, based on area
 */
export const getLargestSize = (objects: ISized[]): ISized => {
    return objects.reduce(returnLarger);
};
export const getSmallestSize = (objects: ISized[]): ISized => {
    return objects.reduce(returnSmaller);
};
/**
 * gets the smallest size which is larger than the provided width
 */
export const getWidthSize = (objects: ISized[], width: number): ISized => {
    const larger = objects.filter(o => o.width >= width);
    return getSmallestSize(larger);
};
/**
 * aspect ratio does not matter
 * want the smallest size which is large enough to cover the target on both dimensions
 */
export const getCoverSize = (objects: ISized[], target: ISized): ISized => {
    return getSmallestSize(objects.filter(covers(target)));
};
