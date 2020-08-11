import {covers, fits, isAspectRatio, returnLarger, returnSmaller} from "./sized-util";
import {I_Sized} from "./types";

/**
 * define a generic SizeFinder class which holds either a plain array or a keyed object
 * of objects implementing I_Sized.
 *
 * this object can then be used to filter and search those objects
 *
 * it is primarily used for finding the best size image file for a given display size
 *
 * it is recommended to pass in the aspectRatio in order to filter those with the "correct" ratio,
 * but if none is provided it will be computed from the largest size, assuming that thumbnails
 * may use a different ratio but the full size is the "true" ratio
 */
export class SizeFinder<T extends I_Sized> {
    public readonly aspectRatio: number;
    public readonly sizes: Record<string | number, T>;

    /**
     * it is assumed -- but not enforced -- that the sizes array/object is not empty
     * otherwise functions like getLargestSize() won't return an object
     */
    constructor(sizes: Record<string | number, T>, aspectRatio: number) {
        this.aspectRatio = aspectRatio;
        this.sizes = sizes;
        //maybe make sure each size is valid?
    }

    /**
     * returns an array of sizes, regardless of if it's stored as a keyed record
     */
    get sizeArray(): T[] {
        return Object.values(this.sizes);
    }

    /**
     * returns the largest size by area
     */
    getLargestSize = (): T => {
        return this.sizeArray.reduce(returnLarger);
    };

    /**
     * returns the smallest size by area
     */
    getSmallestSize = (): T => {
        return this.sizeArray.reduce(returnSmaller);
    };

    /**
     * if the sizes are a keyed object, can retrieve a size by its key
     * will default to the largest size if key is not found
     */
    getNamedSize = (size: string): T | undefined => {
        return this.sizes[size] || this.getLargestSize();
    };

    /**
     * if aspectRatio is left blank, get the sizes which match the image aspectRatio
     * or provide an aspectRatio to get images matching that ratio
     *
     * need to allow some margin of error when comparing aspect ratios to account for rounding
     * defaults to 1 pixel but can be adjusted
     */
    getAspectRatioSizes = (ratio: number = this.aspectRatio, pixelFuzz: number = 1): T[] => {
        return this.sizeArray.filter(isAspectRatio(ratio, pixelFuzz));
    };

    /**
     * in order to cover a target, BOTH the height and the width must be larger
     * searches for the smallest size which achieves this
     * and returns the largest available size if none are large enough to cover
     * aspect ratio does not matter as it will be cut off anyways
     */
    getCoverSize = (target: Partial<I_Sized>): T => {
        //not the most efficient because it loops through twice, but it is clean
        const coverSizes = this.sizeArray.filter(covers(target));
        return (coverSizes.length) ? coverSizes.reduce(returnSmaller) : this.getLargestSize();
    }

    /**
     * if an object is contained in a target, looking for the smallest size where
     * EITHER the height or the width is larger than the target
     * if only one dimension is defined, want to exceed that dimension, not just exceed the undefined one
     */
    getContainSize = (target: Partial<I_Sized>): T => {
        const okSizes = this.sizeArray.filter( size => ! fits(target)(size) );
        return (okSizes.length) ? okSizes.reduce(returnSmaller) : this.getLargestSize();
    }

    /**
     * get the smallest size with width greater than or equal to the desired width
     * should this only include aspect ratio matches??
     */
    getSizeByWidth = (width: number): T => {
        return this.getCoverSize({width});
    };

    /**
     * get the smallest size with height greater than or equal to the desired height
     */
    getSizeByHeight = (height: number): T => {
        return this.getCoverSize({height});
    };
}

export default SizeFinder;
