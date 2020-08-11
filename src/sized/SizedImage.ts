import {ScaledVersionCreator} from "../scaling/ScaledVersion";
import {I_Sized} from "./types";

/**
 * SizedImage was previously a class extending ScalableObject
 * refactor into a plain object interface
 */

export interface I_SizedImage extends I_Sized {
    width: number;
    height: number;
    source_url: string,
}

/**
 * can pass parameters with any name and make a SizedImage with the right properties
 */
export const createSizedImage = ( source_url: string, width: number, height: number): I_SizedImage => ({
    width,
    height,
    source_url,
});


export const scaledVersionCreator = ( sizedImage: I_SizedImage ) =>
    new ScaledVersionCreator(['width', 'height'], sizedImage);
