import {IPoint} from "./types";

/**
 * move just the x value of a point
 */
export const shiftX = (pos: IPoint, change: number): IPoint => ({
  x: pos.x + change,
  y: pos.y,
})


/**
 * move just the y value of a point
 */
export const shiftY = (pos: IPoint, change: number): IPoint => ({
    x: pos.x,
    y: pos.y + change,
})


/**
 * move a point based on a change object with x move and y move
 */
export const shiftBy = (pos: IPoint, change: IPoint): IPoint => ({
    x: pos.x + change.x,
    y: pos.y + change.y,
})
