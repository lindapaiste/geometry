import {IRectangle} from "./types";
import ImmutableRectangle from "./ImmutableRectangle";

/**
 * extract just the I_Rectangle props so that it doesn't matter if it's an entire class implementing I_Rectangle (which
 * might not be spreadable). this is needed for comparing equality in jest tests
 */
export const toRectangleProps = (obj: IRectangle): IRectangle => ({
    x: obj.x,
    y: obj.y,
    width: obj.width,
    height: obj.height,
});

/**
 * this check isn't entirely necessary because it will work fine to always construct a new class,
 * but this function will return the existing class if it's already a class rather than constructing a new instance.
 */
export const toRectangleClass = (obj: IRectangle): ImmutableRectangle => {
    if (obj instanceof ImmutableRectangle) {
        return obj;
    } else {
        return new ImmutableRectangle(obj);
    }
}
