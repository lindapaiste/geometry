import {I_Rectangle} from "./types";

/**
 * extract just the I_Rectangle props so that it doesn't matter
 * if it's an entire class implementing I_Rectangle (which might not be spreadable)
 * primarily used for testing
 */
export const toRectangleProps = (obj: I_Rectangle): I_Rectangle => ({
    x: obj.x,
    y: obj.y,
    width: obj.width,
    height: obj.height,
});
