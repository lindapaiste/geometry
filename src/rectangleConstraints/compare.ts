import {IRectangle, RectangleValues, toRectangleClass} from "../rectangle";
import {ALL_POINTS, XNAMES, YNAMES} from "../rectanglePoints/pointConstants";
import {IRectanglePoint} from "../rectanglePoints";
import {isSameAspectRatio, isSameSize, isSameValue} from "../sized/sized-util";
import {isSameXY} from "../points/compare";

export const PROPERTIES: (keyof RectangleValues)[] = [...XNAMES, ...YNAMES, "width", "height"];

/**
 * Find properties which are the same between two rectangles. If b is a stretched or scaled version of a, it should be
 * the properties of a fixed point.  If b is a shift of a, it should be at least width and height.
 */
export const sharedProperties = (a: Partial<RectangleValues>, b: Partial<RectangleValues>, margin?: number): Partial<RectangleValues> => {
    const shared: Partial<RectangleValues> = {};
    PROPERTIES.forEach( name => {
        if (isSameValue(a[name], b[name], margin)) {
            shared[name] = a[name];
        }
    });
    return shared;
}

/**
 * look at each of the 9 rectangle points and return the ones which have the same values
 */
export const sharedPoints = (a: IRectangle, b: IRectangle, margin?: number): IRectanglePoint[] => {
    const shared: IRectanglePoint[] = [];
    const aRect = toRectangleClass(a);
    const bRect = toRectangleClass(b);
    ALL_POINTS.forEach( pointName => {
        if ( isSameXY(aRect.getPoint(pointName), bRect.getPoint(pointName), margin) ) {
            shared.push( aRect.getPoint(pointName));
        }
    });
    return shared;
}

// note: can go from shared points to shared properties and back

/**
 * true if a and b are the same size and at the same position
 */
export const isSameRectangle = (a: IRectangle, b: IRectangle, margin?: number) => {
    return isSameSize(a, b, margin) && isSameXY(a, b, margin);
}

/**
 * true if a and b are the same size but at different positions
 */
export const isShifted = (a: IRectangle, b: IRectangle, margin?: number) => {
    return isSameSize(a, b, margin) && ! isSameXY(a, b, margin);
}

/**
 * true if a and b are different sizes, but have the same aspect ratio
 * position is not examined
 */
export const isScaled = (a: IRectangle, b: IRectangle, margin?: number) => {
    // not sure of the best way to handle margin because aspect ration margin should be smaller than size margin
    return isSameAspectRatio(a, b) && ! isSameSize(a, b, margin);
}

/**
 * true if a and b are different sizes and have different aspect ratios
 * position is not examined
 */
export const isStretched = (a: IRectangle, b: IRectangle, margin?: number) => {

}

export const pointToProperties = ({x, y, xName, yName}: IRectanglePoint): Partial<RectangleValues> => ({
    [xName]: x,
    [yName]: y,
});
