import {PropHeight, PropWidth, Sized} from "../coreTypes";
import ScaledVersionCreator, {ApplyScaledValues} from "./ScaledVersion";
import ScaleCalculator from "./ScalableCalculator";

type WH = "width" | "height";

export class ScaledObjectCreator<OT extends Sized> extends ScaledVersionCreator<WH, OT> {
    constructor(object: OT, applyScaledValues?: ApplyScaledValues<WH, OT>) {
        super(["width", "height"], object, applyScaledValues);
    }
}

/*export const ScaledObjectCreator = <OT extends Sized>(object: OT, applyScaledValues?: ApplyScaledValues<'width' | 'height', OT & StringIndexed>) => {
  return new ScaledVersionCreator<'width' | 'height', OT>(['width', 'height'], object, applyScaledValues);
};*/

export const getScaleToCover = (object: Sized, target: Partial<Sized>): number => {
    return new ScaleCalculator(["width", "height"], object).calcScaleToCover(target);
};

export const getScaleToFit = (object: Sized, target: Partial<Sized>): number => {
    return new ScaleCalculator(["width", "height"], object).calcScaleToFit(target);
};

/**
 * note: this can be done through the ScaleCalculator, but the calculation is so trivial that it is unnecessary
 *
 * return new ScaleCalculator(["width", "height"], object).calcScalePropertyToValue("height", height);
 */

export const getScaleForHeight = (object: PropHeight, height: number): number => {
    return height / object.height;
};
export const getScaleForWidth = (object: PropWidth, width: number): number => {
    return width / object.width;
};

/**
 * if fitting a 500 x 500 image to a 300 x 400 area, the displayed size is 300 x 300
 * will have the aspect ratio of the object
 */
export const fitDisplayedSize = (object: Sized, target: Sized): Sized => {
    const calc = new ScaleCalculator(["width", "height"], object);
    return calc.getScaledValues(calc.calcScaleToFit(target));
};
