import ScaleCalculator from "./ScalableCalculator";
import {IScalableObject, Limits} from "./types";
import {Range} from "../coreTypes";

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
export const defaultApplyScaledValues = <Scalable extends string,
    OT extends Record<Scalable, number>>(
    values: Required<Pick<OT, Scalable>>,
    original: OT
): OT => {
    return {
        ...original,
        ...values,
    };
};

/**
 * function signature to adhere to
 */
export type ApplyScaledValues<Scalable extends string,
    OT extends Record<Scalable, number>> = (values: Required<Pick<OT, Scalable>>, original: OT) => OT;

export default class ScaledVersionCreator<Scalable extends string,
    OT extends Record<Scalable, number>> implements IScalableObject<Scalable, OT> {
    private readonly calculator: ScaleCalculator<Scalable, OT>;
    private readonly original: OT;
    private readonly apply: ApplyScaledValues<Scalable, OT>;

    /**
     * construct by passing the names of the properties which are scalable and the object
     */
    constructor(
        scalableProperties: Scalable[],
        object: OT,
        applyScaledValues: ApplyScaledValues<Scalable,
            OT> = defaultApplyScaledValues
    ) {
        this.calculator = new ScaleCalculator<Scalable, OT>(
            scalableProperties,
            object
        );
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
        return this.scale(
            this.calculator.calcScalePropertyToValue(propertyName, value)
        );
    }

    scalePropertyToRange(propertyName: Scalable, range: Range): OT {
        return this.scale(
            this.calculator.calcScalePropertyToRange(propertyName, range)
        );
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
