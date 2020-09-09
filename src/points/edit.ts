import {Point, XY} from "../coreTypes";

// ------------------FOR ANY EXTENDING INTERFACE--------------- //

/**
 * use spread operator to keep all values of the initial object
 * will work for any plain object, but not classes
 */
export const setX = <T extends { x: number }>(obj: T, x: number): T => ({
    ...obj,
    x
});

export const setY = <T extends { y: number }>(obj: T, y: number): T => ({
    ...obj,
    y
});

export const setXY = <T extends XY>(obj: T, pos: Partial<XY>): T => ({
    ...obj,
    ...pos,
});

export const shiftX = <T extends { x: number }>(obj: T, change: number): T =>
    setX(obj, obj.x + change);

export const shiftY = <T extends { y: number }>(obj: T, change: number): T =>
    setY(obj, obj.y + change);

export const shiftBy = <T extends XY>(obj: T, change: Partial<XY>): T => ({
    ...obj,
    ...shiftPointBy(obj, change)
});

// ------------------FOR POINTS SPECIFICALLY--------------- //

/**
 * with these functions, pos can be any interface implementing Point (even through getters),
 * but the returned object is just a Point and does not copy the prototype or any other object properties from pos.
 */

/**
 * move just the x value of a point
 */
export const shiftPointX = (pos: Point, change: number): Point =>
    shiftPointBy(pos, {x: change});

/**
 * move just the y value of a point
 */
export const shiftPointY = (pos: Point, change: number): Point =>
    shiftPointBy(pos, {y: change});

/**
 * move a point based on a change object with x move and y move
 */
export const shiftPointBy = (pos: Point, change: Partial<Point>): Point => ({
    x: pos.x + (change.x ?? 0),
    y: pos.y + (change.y ?? 0),
});
