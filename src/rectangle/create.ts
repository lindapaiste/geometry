import {Sized} from "../coreTypes";
import {RectanglePoint} from "./points";
import {ImmutableRectangle} from "./index";

/**
 * can create a rectangle from:
 * size + x/y
 * size + named point
 * two named points - must be different in both the x and y
 * coordinates
 * ratio + side?
 */

/**
 * create a rectangle of a given size which has the provided point
 */
export const rectangleThroughPoint = (size: Sized, fixedPoint: RectanglePoint) => {
    // can do with RectangleAccessor and Editor
    const sized = new ImmutableRectangle(size);
    return sized.shiftToPoint(fixedPoint);
}
