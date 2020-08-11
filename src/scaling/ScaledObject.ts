import {I_Sized} from "..";
import {ApplyScaledValues, ScaledVersionCreator} from "./ScaledVersion";
import ScaleCalculator from "./ScalableCalculator";

type WH = 'width' | 'height';

export class ScaledObjectCreator<OT extends I_Sized> extends ScaledVersionCreator<WH, OT> {
    constructor(object: OT, applyScaledValues?: ApplyScaledValues<WH, OT>) {
        super(['width', 'height'], object, applyScaledValues);
    }
}

/*export const ScaledObjectCreator = <OT extends Sized>(object: OT, applyScaledValues?: ApplyScaledValues<'width' | 'height', OT & StringIndexed>) => {
  return new ScaledVersionCreator<'width' | 'height', OT>(['width', 'height'], object, applyScaledValues);
};*/


export const getScaleToCover = (object: I_Sized, target: Partial<I_Sized>): number => {
    return (new ScaleCalculator(['width', 'height'], object)).calcScaleToCover(target);
}

export const getScaleToFit = (object: I_Sized, target: Partial<I_Sized>): number => {
    return (new ScaleCalculator(['width', 'height'], object)).calcScaleToFit(target);
}

export const getScaleForHeight = (object: I_Sized, height: number): number => {
    return (new ScaleCalculator(['width', 'height'], object)).calcScalePropertyToValue('height', height);
}

export const getScaleForWidth = (object: I_Sized, width: number): number => {
    return (new ScaleCalculator(['width', 'height'], object)).calcScalePropertyToValue('width', width);
}
