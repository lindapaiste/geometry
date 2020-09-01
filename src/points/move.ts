import {IPoint} from "./types";

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
export const shiftPointX = (pos: IPoint, change: number): IPoint =>
    setX(pos, pos.x + change);

/**
 * move just the y value of a point
 */
export const shiftPointY = (pos: IPoint, change: number): IPoint =>
    setY(pos, pos.y + change);


/**
 * move a point based on a change object with x move and y move
 */
export const shiftPointBy = (pos: IPoint, change: IPoint): IPoint => ({
    x: pos.x + change.x,
    y: pos.y + change.y,
})
