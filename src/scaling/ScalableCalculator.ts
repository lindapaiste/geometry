import {fromPairs} from "lodash";
import {Limits} from "./types";
import {I_NumericRange} from "../range/types";

export class ScaleCalculator<Scalable extends string, OT extends Record<Scalable, number>> {
    private readonly scalableProperties: Scalable[];
    private readonly object: OT;

    constructor(scalableProperties: Scalable[], object: OT) {
        this.scalableProperties = scalableProperties;
        this.object = object;
    }

    private _getScaledValue(propertyName: Scalable, scale: number): number {
        return this._currentValue(propertyName) * scale;
    }

    private _currentValue(propertyName: Scalable): number {
        return this.object[propertyName];
    }

    getScaledValues(scale: number): Required<Pick<OT, Scalable>> {
        const pairs: [Scalable, number][] = this.scalableProperties.map(propertyName => ([
            propertyName, this._getScaledValue(propertyName, scale)
        ]));
        return fromPairs(pairs) as Required<Pick<OT, Scalable>>;
    }

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

    calcScalePropertyToRange(propertyName: Scalable, range: I_NumericRange): number {
        const currentValue = this._currentValue(propertyName);
        console.log(`value ${propertyName} must be in range ${range.min} to ${range.max} and is currently ${currentValue}`);
        if (!range.contains(currentValue)) {
            const value = range.constrain(currentValue);
            return this.calcScalePropertyToValue(propertyName, value);
        } else {
            //if value is already acceptable, make no changes
            return 1;
        }
    }

    /**
     * @param {object} propertyMaximums is an object where the keys are the property names and the values are the
     *     maximum value for that property
     * @return {number} the largest scale for which all properties are less than the provided maximum
     */
    calcScaleToFit(propertyMaximums: Limits<Scalable>): number {
        //in order to meet all conditions, we want the MINIMUM
        return Math.min(...this._getScalesFromLimits(propertyMaximums));
    }

    /**
     * @param {object} propertyMinimums is an object where the keys are the property names and the values are the
     *     minimum value for that property
     * @return {number} the smallest scale for which all properties are greater than the provided minimum
     */
    calcScaleToCover(propertyMinimums: Limits<Scalable>): number {
        //in order to meet all conditions, we want the MAXIMUM
        return Math.max(...this._getScalesFromLimits(propertyMinimums));
    }

    /**
     * get an array of scales which correspond to the conditions
     * use min or max in order to meet all conditions, as applicable
     */
    private _getScalesFromLimits(limits: Limits<Scalable>): number[] {
        /**
         * limits may have a key be set, but the value undefined
         * so cannot just loop through keys of limits
         * must skip over both missing keys and keys with no value
         */
        const scales: number[] = [];
        this.scalableProperties.forEach(propertyName => {
            const limitVal = limits[propertyName] || undefined; //can do this whether or not the property exists
                                                                // because I defined Limits to be string-indexed
            if (limitVal !== undefined) {
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

export default ScaleCalculator;
