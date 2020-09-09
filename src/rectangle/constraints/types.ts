import {Sized} from "../../coreTypes";
import {XName, YName} from "../points";

export type Properties = Record<XName | YName | keyof Sized, number>


export interface AdjustModes {
    isScalable: boolean;
    isMovable: boolean;
    isStretchable: boolean;
}
