import {IRectangle} from "./types";

/**
 * extract just the I_Rectangle props so that it doesn't matter
 * if it's an entire class implementing I_Rectangle (which might not be spreadable)
 * primarily used for testing
 */
export const toRectangleProps = (obj: IRectangle): IRectangle => ({
    x: obj.x,
    y: obj.y,
    width: obj.width,
    height: obj.height,
});
