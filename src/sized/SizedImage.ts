import ScaledVersionCreator from "../scaling/ScaledVersion";
import {Sized} from "../coreTypes";

/**
 * SizedImage was previously a class extending ScalableObject
 * refactor into a plain object interface
 */

export interface ISizedImage extends Sized {
  width: number;
  height: number;
  source_url: string;
}

/**
 * can pass parameters with any name and make a SizedImage with the right properties
 */
export const createSizedImage = (
  src: string,
  width: number,
  height: number
): ISizedImage => ({
  width,
  height,
  source_url: src,
});

export const scaledVersionCreator = (sizedImage: ISizedImage) =>
  new ScaledVersionCreator(["width", "height"], sizedImage);
