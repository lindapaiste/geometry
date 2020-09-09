import {Point} from "../coreTypes";

/**
 * use spread operator to keep all values of the initial object
 */
export const setY = <T extends {y: number}>(obj: T, y: number): T => ({
    ...obj,
    y
});
export const setX = <T extends {x: number}>(obj: T, x: number): T => ({
    ...obj,
    x
});

/**
 * move just the x value of a point
 */
export const shiftPointX = (pos: Point, change: number): Point =>
    setX(pos, pos.x + change);

/**
 * move just the y value of a point
 */
export const shiftPointY = (pos: Point, change: number): Point =>
    setY(pos, pos.y + change);


/**
 * move a point based on a change object with x move and y move
 */
export const shiftPointBy = (pos: Point, change: Point): Point => ({
    x: pos.x + change.x,
    y: pos.y + change.y,
})
