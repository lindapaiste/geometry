import {CanScale, Constructor} from "./types";
import {Limits} from "../scaling/types";
import {extractSize, Range, Sized} from "../coreTypes";
import ScalableCalculator from "../scaling/ScalableCalculator";

/**
 * add advanced scale functions to a class
 *
 * class must have:
 * - a method scale() which takes a single number value
 * - a property .scalable which returns an object of the keys and numeric values which are scalable
 *
 * could put ScalableCalc in its own mixin, but right now using an instance of the class
 */

type Calculatable<Keys extends keyof any> = { scalable: Record<Keys, number> };

type Scalable<Keys extends keyof any> = CanScale<Calculatable<Keys>> & { scalable: Record<Keys, number> };

type InferScalable<T> = T extends Constructor<Calculatable<infer S>> ? S : never;

export function WithScalableCalc<Keys extends string, TBase extends Constructor<Calculatable<Keys>>>(Base: TBase) {

    return class WithScalableCalc extends Base {

        _calc = new ScalableCalculator<Keys, Record<Keys, number>>(Object.keys(this.scalable) as Keys[], this.scalable);

        calcScalePropertyToValue(basisProperty: Keys, basisValue: number): number {
            return this._calc.calcScalePropertyToValue(basisProperty, basisValue);
        }

        /**
         * calculate a scale which forces the given property into the given range
         * if the value is already in range, return 1 so as not to make any changes
         */
        calcScalePropertyToRange(propertyName: Keys, range: Range): number {
            return this._calc.calcScalePropertyToRange(propertyName, range);
        }

        /**
         * @param {object} propertyMaximums is an object where the keys are the property names and the values are the
         *     maximum value for that property
         * @return {number} the largest scale for which all properties are less than the provided maximum
         */
        calcScaleToFit(propertyMaximums: Limits<Keys>): number {
            return this._calc.calcScaleToFit(propertyMaximums);
        }

        /**
         * @param {object} propertyMinimums is an object where the keys are the property names and the values are the
         *     minimum value for that property
         * @return {number} the smallest scale for which all properties are greater than the provided minimum
         */
        calcScaleToCover(propertyMinimums: Limits<Keys>): number {
            return this._calc.calcScaleToCover(propertyMinimums);
        }
    }
}

/**
 * instead of specifying scalable properties, can use this mixin for objects which have width and height as their only
 * scalable properties
 */
export function WithPropScalable<TBase extends Constructor<Sized>>(Base: TBase) {
    return class extends Base {
        get scalable(): Sized {
            return extractSize(this);
        }
    }
}
