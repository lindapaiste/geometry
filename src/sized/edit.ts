import {Sized} from "../coreTypes";
import {getArea} from "./compute";

// note: can use methods from ScaledObject class, getScaleForHeight, etc.

/**
 * Applies a scale to an object, altering both the width and height while preserving the aspect ratio
 */
export const scale = (obj: Sized, scale: number): Sized => {
    return {
        width: obj.width * scale,
        height: obj.height * scale
    }
};

/**
 * Scales such that the width matches the passed value while preserving the current aspect ratio
 */
export const scaleToWidth = (obj: Sized, width: number): Sized => {
    const float = width / obj.width;
    return scale(obj, float);
};

/**
 * Scales such that the height matches the passed value while preserving the current aspect ratio
 */
export const scaleToHeight = (obj: Sized, height: number): Sized => {
    const float = height / obj.height;
    return {
        height,
        width: obj.width * float
    }
};

/**
 * Change the width without making any changes to height, thereby altering the aspect ratio.
 */
export const stretchToWidth = (obj: Sized, width: number): Sized => {
    return {
        height: obj.height,
        width
    }
};

/**
 * Change the height without making any changes to width, thereby altering the aspect ratio.
 */
export const stretchToHeight = (obj: Sized, height: number): Sized => {
    return {
        width: obj.width,
        height
    }
};

/**
 * Alter a size such that it has the desired aspect ratio.  This can be done by changing just the height, just
 * the width, or both.  Determine which to change and which to keep through prop "preserve" which accepts values
 * "width" (change the height), "height" (change the width), or "area" (change both height and width, but keep the
 * same area).  Defaults to "area."
 */
export const stretchToRatio = (obj: Sized, ratio: number, preserve: "width" | "height" | "area" = "area"): Sized => {
    if (preserve === "width") {
        return {
            width: obj.width,
            height: obj.width / ratio,
        }
    } else if (preserve === "height") {
        return {
            height: obj.height,
            width: obj.height * ratio,
        }
    } else {
        const area = getArea(obj);
        return {
            width: Math.sqrt(ratio * area),
            height: Math.sqrt(area / ratio),
        }
    }
};
