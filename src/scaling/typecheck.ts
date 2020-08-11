import {I_Scalable} from "./types";

export const hasScaleMethod = <T extends Partial<I_Scalable>>(object: T): object is T & I_Scalable => {
    return 'scale' in object && typeof object.scale === "function";
}
