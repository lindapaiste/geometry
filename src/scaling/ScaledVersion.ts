import ScaleCalculator from "./ScalableCalculator";
import {I_ScalableObject, Limits} from "./types";
import {I_NumericRange} from "../range/types";
import {I_Sized} from "../sized/types";

/**
 * create a clone of an object which is scaled to size
 * do not mutate the object
 * can override default params for custom implementation rather than extending
 */

/**
 * previously passed in an "applyScaledValues" method through constructor
 * applyScaledValues: ApplyScaledValues<Scalable, OT> = defaultApplyScaledValues
 *
 * default logic works for any plain JS object, but not for classes
 */
export const defaultApplyScaledValues = <Scalable extends string, OT extends Record<Scalable, number>>(values: Required<Pick<OT, Scalable>>, original: OT): OT => {
    return {
        ...original,
        ...values,
    }
};

/**
 * function signature to adhere to
 */
export interface ApplyScaledValues<Scalable extends string, OT extends Record<Scalable, number>> {
    (values: Required<Pick<OT, Scalable>>, original: OT): OT,
}

export class ScaledVersionCreator<Scalable extends string, OT extends Record<Scalable, number>> implements I_ScalableObject<Scalable, OT> {
    private readonly calculator: ScaleCalculator<Scalable, OT>;
    private readonly original: OT;
    private readonly apply: ApplyScaledValues<Scalable, OT>;


    /**
     * construct by passing the names of the properties which are scalable and the object
     */
    constructor(scalableProperties: Scalable[], object: OT, applyScaledValues: ApplyScaledValues<Scalable, OT> = defaultApplyScaledValues) {
        this.calculator = new ScaleCalculator<Scalable, OT>(scalableProperties, object);
        this.original = object;
        this.apply = applyScaledValues;
    }

    /**
     * SCALE ON ONE DIMENSION
     */

    scale(scale: number): OT {
        return this.apply(this.calculator.getScaledValues(scale), this.original);
    }

    scalePropertyToValue(propertyName: Scalable, value: number): OT {
        return this.scale(this.calculator.calcScalePropertyToValue(propertyName, value));
    }

    scalePropertyToRange(propertyName: Scalable, range: I_NumericRange): OT {
        return this.scale(this.calculator.calcScalePropertyToRange(propertyName, range));
    }

    /**
     * SCALE ON MULTIPLE DIMENSIONS
     */

    scaleToFit(propertyMaximums: Limits<Scalable>): OT {
        return this.scale(this.calculator.calcScaleToFit(propertyMaximums));
    }

    scaleToCover(propertyMinimums: Limits<Scalable>): OT {
        return this.scale(this.calculator.calcScaleToCover(propertyMinimums));
    }
}

type WH = 'width' | 'height';

export class ScaledObjectCreator<OT extends I_Sized> extends ScaledVersionCreator<WH, OT> {
    constructor(object: OT, applyScaledValues?: ApplyScaledValues<WH, OT>) {
        super(['width', 'height'], object, applyScaledValues);
    }
}

/*export const ScaledObjectCreator = <OT extends Sized>(object: OT, applyScaledValues?: ApplyScaledValues<'width' | 'height', OT & StringIndexed>) => {
  return new ScaledVersionCreator<'width' | 'height', OT>(['width', 'height'], object, applyScaledValues);
};*/
