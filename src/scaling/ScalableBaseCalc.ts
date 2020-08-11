import {Limits} from "./types";
import {IRangeMethods} from "../range/types";

/**
 * this class can handle scaling of any values, not just height and width
 *
 * if given an object with a scale() property, can execute the scaling
 * but if just given a set of properties, can still compute the scale
 * so break into two classes
 */
export default class ScalableBaseCalc<Scalable extends string> {
    /**
     * array of strings of the properties which need to be kept in scale
     */
    private readonly keys: Scalable[];
    /**
     * store the current object because need to access its properties
     */
    private readonly values: Record<Scalable, number>;


    /**
     * rather than passing in string name, expect to pass in a plain object with JUST the properties that are scalable
     * then know that the only scalable properties are the keys
     */
    constructor(keyedProperties: Record<Scalable, number>) {
        this.keys = Object.keys(keyedProperties) as Scalable[];
        this.values = keyedProperties;
    }

    private _getScaledValue(propertyName: Scalable, scale: number): number {
        return this._currentValue(propertyName) * scale;
    }

    private _currentValue(propertyName: Scalable): number {
        return this.values[propertyName];
    }

    /**
     * maps the current values of scalable properties to new values
     */
    getScaledValues(scale: number): Record<Scalable, number> {
        const scaled: Partial<Record<Scalable, number>> = {};
        this.keys.forEach(key => scaled[key] = this.values[key] * scale);
        return scaled as Record<Scalable, number>;
    }

    /**
     * calculates the scale needed for the provided property to equal the provided value
     */
    calcScalePropertyToValue(basisProperty: Scalable, basisValue: number): number {
        const currentValue = this._currentValue(basisProperty);
        return basisValue / currentValue;
    }

    /**
     * for scaling width based on height, etc.
     */
    getScaledProperty(propertyName: Scalable, basisProperty: Scalable, basisValue: number): number {
        const scale = this.calcScalePropertyToValue(basisProperty, basisValue);
        return this._getScaledValue(propertyName, scale);
    }

    /**
     * scale a property such that it falls within the provided range
     * or do nothing ( return scale = 1 ) if the property is anywhere within the range
     */
    calcScalePropertyToRange(propertyName: Scalable, range: IRangeMethods<number>): number {
        const currentValue = this._currentValue(propertyName);
        // console.log(`value ${propertyName} must be in range ${range.min} to ${range.max} and is currently ${currentValue}`);
        if (!range.contains(currentValue)) {
            const value = range.constrain(currentValue);
            return this.calcScalePropertyToValue(propertyName, value);
        } else {
            // if value is already acceptable, make no changes
            return 1;
        }
    }

    /**
     * pass in an object where the keys are the property names and the values are the maximum value for that property
     * in order to meet all conditions, we want the MINIMUM
     */
    calcScaleToMaximize(propertyMaximums: Limits<Scalable>): number {
        return Math.min(...this._getScalesFromLimits(propertyMaximums));
    }

    /**
     * pass in an object where the keys are the property names and the values are the minimum value for that property
     * in order to meet all conditions, we want the MAXIMUM
     */
    calcScaleToMinimize(propertyMinimums: Limits<Scalable>): number {
        return Math.max(...this._getScalesFromLimits(propertyMinimums));
    }

    /**
     * get an array of scales which correspond to the conditions
     * use min or max in order to meet all conditions, as applicable
     */
    private _getScalesFromLimits(limits:  Limits<Scalable>): number[] {
        /**
         * limits may have a key be set, but the value undefined
         * so cannot just loop through keys of limits
         * must skip over both missing keys and keys with no value
         */
        const scales: number[] = [];
        this.keys.forEach(propertyName => {
            const limitVal = limits[propertyName];
            if (typeof limitVal === "number") {
                scales.push(this.calcScalePropertyToValue(propertyName, limitVal));
            }
        });
        /**
         * limits can possibly be empty, so use scale = 1 as a fallback to avoid infinity
         */
        if (!scales.length) {
            return [1];
        }
        return scales;
    }
}
