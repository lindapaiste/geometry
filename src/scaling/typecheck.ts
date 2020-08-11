import {IScalable} from "./types";

export const hasScaleMethod = <T extends Partial<IScalable>>(object: T): object is T & IScalable => {
    return 'scale' in object && typeof object.scale === "function";
}
