import {I_Sized} from "./types";
import {covers, isAspectRatio, returnLarger, returnSmaller} from "./sized-util";

/**functions which act upon an array of Sized objects */


/**
 * filter an array of sizes to only those that match the given aspect ratio
 */
export const getAspectRatioSizes = (objects: I_Sized[], ratio: number): I_Sized[] => {
    //return objects.filter( obj => getAspectRatio(obj) === ratio);
    return objects.filter(isAspectRatio(ratio));
};
/**
 * gets the largest object in the array, based on area
 */
export const getLargestSize = (objects: I_Sized[]): I_Sized => {
    return objects.reduce(returnLarger);
};
export const getSmallestSize = (objects: I_Sized[]): I_Sized => {
    return objects.reduce(returnSmaller);
};
/**
 * gets the smallest size which is larger than the provided width
 */
export const getWidthSize = (objects: I_Sized[], width: number): I_Sized => {
    const larger = objects.filter(o => o.width >= width);
    return getSmallestSize(larger);
};
/**
 * aspect ratio does not matter
 * want the smallest size which is large enough to cover the target on both dimensions
 */
export const getCoverSize = (objects: I_Sized[], target: I_Sized): I_Sized => {
    return getSmallestSize(objects.filter(covers(target)));
};
