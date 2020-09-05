import {XNames, YNames} from "../../lib/rectanglePoints/enums";
import {ISized} from "../sized";

export type Properties = Record<XNames | YNames | keyof ISized, number>


export interface AdjustModes {
    isScalable: boolean;
    isMovable: boolean;
    isStretchable: boolean;
}
