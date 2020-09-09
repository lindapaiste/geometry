import {RectangleValues, toRectangleClass} from "../index";
import {ALL_POINTS, IRectanglePoint, XNAMES, YNAMES} from "../points";
import {isSameAspectRatio, isSameSize} from "../../sized/compare";
import {isSameXY} from "../../points";
import {Rectangle} from "../../coreTypes";
import {isSameValue} from "../../isSameValue";

export const PROPERTIES: (keyof RectangleValues)[] = [...XNAMES, ...YNAMES, "width", "height"];

/**
 * Find properties which are the same between two rectangles. If b is a stretched or scaled version of a, it should be
 * the properties of a fixed point.  If b is a shift of a, it should be at least width and height.
 */
export const sharedProperties = (a: Partial<RectangleValues>, b: Partial<RectangleValues>, margin?: number): Partial<RectangleValues> => {
    const shared: Partial<RectangleValues> = {};
    PROPERTIES.forEach(name => {
        if (isSameValue(a[name], b[name], margin)) {
            shared[name] = a[name];
        }
    });
    return shared;
}

/**
 * look at each of the 9 rectangle points and return the ones which have the same values
 */
export const sharedPoints = (a: Rectangle, b: Rectangle, margin?: number): IRectanglePoint[] => {
    const shared: IRectanglePoint[] = [];
    const aRect = toRectangleClass(a);
    const bRect = toRectangleClass(b);
    ALL_POINTS.forEach(pointName => {
        if (isSameXY(aRect.getPoint(pointName), bRect.getPoint(pointName), margin)) {
            shared.push(aRect.getPoint(pointName));
        }
    });
    return shared;
}

// note: can go from shared points to shared properties and back

/**
 * true if a and b are the same size and at the same position
 */
export const isSameRectangle = (a: Rectangle, b: Rectangle, margin?: number) => {
    return isSameSize(a, b, margin) && isSameXY(a, b, margin);
}

/**
 * true if a and b are the same size but at different positions
 */
export const isShifted = (a: Rectangle, b: Rectangle, margin?: number) => {
    return isSameSize(a, b, margin) && !isSameXY(a, b, margin);
}

/**
 * true if a and b are different sizes, but have the same aspect ratio
 * position is not examined
 */
export const isScaled = (a: Rectangle, b: Rectangle, margin?: number) => {
    // not sure of the best way to handle margin because aspect ration margin should be smaller than size margin
    return isSameAspectRatio(a, b) && !isSameSize(a, b, margin);
}

/**
 * true if a and b are different sizes and have different aspect ratios
 * position is not examined
 */
export const isStretched = (a: Rectangle, b: Rectangle, margin?: number) => {
    return !isSameAspectRatio(a, b) && !isSameSize(a, b, margin);
}

export const pointToProperties = ({x, y, xName, yName}: IRectanglePoint): Partial<RectangleValues> => ({
    [xName]: x,
    [yName]: y,
});
