import {I_Point} from "../rectanglePoints/types";
import {I_Sized} from "../sized/types";

export interface I_Coordinates {
    x1: number,
    x2: number,
    y1: number,
    y2: number,
}

export interface I_Rectangle extends I_Sized, I_Point {
    x: number,
    y: number,
    width: number,
    height: number,
}


export interface I_RectangleClass extends I_Point, I_Sized, I_Coordinates, I_Rectangle {

}

