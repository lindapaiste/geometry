import { CENTERS, SIDES, XNames, XSides, YNames, YSides } from "./enums";

export type PointNameTuple = [XNames, YNames];
export type CornerName = [XSides, YSides];
/**
 * Enum for rectangle corners
 * returns ordered pairs of xName and yName which can be used to get the full point object
 * @readonly
 * @enum {string[]}
 */
export const CORNERS: Record<string, CornerName> = Object.freeze({
  TOP_LEFT: [SIDES.LEFT, SIDES.TOP],
  TOP_RIGHT: [SIDES.RIGHT, SIDES.TOP],
  BOTTOM_LEFT: [SIDES.LEFT, SIDES.BOTTOM],
  BOTTOM_RIGHT: [SIDES.RIGHT, SIDES.BOTTOM],
});
export type MidpointName = [XSides, CENTERS.Y] | [CENTERS.X, YSides];
/**
 * Enum for rectangle midpoints
 * returns ordered pairs of xName and yName which can be used to get the full point object
 * @readonly
 * @enum {string[]}
 */
export const MIDPOINTS: Record<string, MidpointName> = Object.freeze({
  CENTER_LEFT: [SIDES.LEFT, CENTERS.Y],
  CENTER_RIGHT: [SIDES.RIGHT, CENTERS.Y],
  TOP_CENTER: [CENTERS.X, SIDES.TOP],
  BOTTOM_CENTER: [CENTERS.X, SIDES.BOTTOM],
});
export type CenterName = [CENTERS.X, CENTERS.Y];
/**
 * Enum for rectangle center point, for the purpose of consistency with corners and midpoints
 * returns ordered pairs of xName and yName which can be used to get the full point object
 * @readonly
 * @enum {string[]}
 */
export const CENTER_POINT: CenterName = [CENTERS.X, CENTERS.Y];
/**
 * Enum combining the corners, midpoints, and center of a rectangle into one
 * returns ordered pairs of xName and yName which can be used to get the full point object
 * @readonly
 * @enum {string[]}
 */
export const POINTS: Record<string, PointNameTuple> = Object.freeze({
  ...CORNERS,
  ...MIDPOINTS,
  CENTER_POINT,
});
