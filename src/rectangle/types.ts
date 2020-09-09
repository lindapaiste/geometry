import {Coordinates, Sized, XY} from "../coreTypes";
import {IPointName, IRectanglePoint, RectanglePoint} from "./points";


// ------------------------- PROPERTIES ----------------------- //

export interface XValues {
    x1: number;
    x2: number;
    xmid: number;
}

export interface YValues {
    y1: number;
    y2: number;
    ymid: number;
}

export interface XYValues extends XValues, YValues {
}

/**
 * for the purposes of containment, define properties as width, height, all x names, and all y names
 * does not require x and y as these are aliases for x1 and y1
 */
export interface RectangleValues extends Coordinates, Sized, XYValues {
}


// ------------------------- METHOD INTERFACES ----------------------- //

/**
 * any object which has a XY position can be shifted
 */
export interface Movable {
    shift(point: Partial<XY>): XY;

    shiftX(change: number): XY;

    shiftY(change: number): XY;

    shiftToX(value: number): XY;

    shiftToY(value: number): XY;
}

/**
 * any object which has a width and height can be scaled
 */
export interface ScalableSize {
    scale(float: number): Sized;

    scaleToWidth(width: number): Sized;

    scaleToHeight(height: number): Sized;
}

/**
 * any object which has a width and height can be stretched
 */
export interface StretchableSize {
    stretchToWidth(width: number): Sized;

    stretchToHeight(width: number): Sized;

    stretchToRatio(ratio: number): Sized;
}
