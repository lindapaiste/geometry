import {ISized} from "..";
import ScaledVersionCreator, {ApplyScaledValues} from "./ScaledVersion";
import ScaleCalculator from "./ScalableCalculator";

type WH = "width" | "height";

export class ScaledObjectCreator<OT extends ISized> extends ScaledVersionCreator<WH, OT> {
    constructor(object: OT, applyScaledValues?: ApplyScaledValues<WH, OT>) {
        super(["width", "height"], object, applyScaledValues);
    }
}

/*export const ScaledObjectCreator = <OT extends Sized>(object: OT, applyScaledValues?: ApplyScaledValues<'width' | 'height', OT & StringIndexed>) => {
  return new ScaledVersionCreator<'width' | 'height', OT>(['width', 'height'], object, applyScaledValues);
};*/

export const getScaleToCover = (
    object: ISized,
    target: Partial<ISized>
): number => {
    return new ScaleCalculator(["width", "height"], object).calcScaleToCover(
        target
    );
};

export const getScaleToFit = (
    object: ISized,
    target: Partial<ISized>
): number => {
    return new ScaleCalculator(["width", "height"], object).calcScaleToFit(
        target
    );
};

export const getScaleForHeight = (object: ISized, height: number): number => {
    return new ScaleCalculator(
        ["width", "height"],
        object
    ).calcScalePropertyToValue("height", height);
};

export const getScaleForWidth = (object: ISized, width: number): number => {
    return new ScaleCalculator(
        ["width", "height"],
        object
    ).calcScalePropertyToValue("width", width);
};

/**
 * if fitting a 500 x 500 image to a 300 x 400 area, the displayed size is 300 x 300
 * will have the aspect ratio of the object
 */
export const fitDisplayedSize = (object: ISized, target: ISized): ISized => {
    const calc = new ScaleCalculator(["width", "height"], object);
    return calc.getScaledValues(calc.calcScaleToFit(target));
};
