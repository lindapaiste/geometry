import {IPoint, ISized, XY} from "..";

export interface IRectangle extends ISized, IPoint {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ICoordinates {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

export interface HasCoordinates {
    coordinates: ICoordinates;
}

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
export interface RectangleValues extends ICoordinates, ISized, XYValues {
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
    scale(float: number): ISized;

    scaleToWidth(width: number): ISized;

    scaleToHeight(height: number): ISized;
}

/**
 * any object which has a width and height can be stretched
 */
export interface StretchableSize {
    stretchToWidth(width: number): ISized;

    stretchToHeight(width: number): ISized;

    stretchToRatio(ratio: number): ISized;
}
