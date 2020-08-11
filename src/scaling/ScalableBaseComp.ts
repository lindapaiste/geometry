import {NumericRange} from "../range/NumericRange";
import _pick from "lodash/pick";
import {I_Scalable, I_ScalableObject, Limits} from "./types";
/**
 * designed to be used with composition rather than inheritance
 * rather than extending this prototype, classes can have an internal ScalableBase
 *
 */


/**
 * this class can handle scaling of any values, not just height and width
 *
 * if given an object with a scale() property, can execute the scaling
 * but if just given a set of properties, an still compute the scale
 * so break into two classes
 */
export class ScalableBase<Scalable extends string, OT extends Record<Scalable, number> & I_Scalable> implements I_ScalableObject<Scalable, OT>{
    /**
     * array of strings of the properties which need to be kept in scale
     */
    private readonly scalableProperties: Scalable[];
    /**
     * store the current object because need to access its properties
     */
    private readonly object: OT;

    constructor(scalableProperties: Scalable[], object: OT ) {
        this.scalableProperties = scalableProperties;
        this.object = object;
    }

    private _getScaledValue( propertyName: Scalable, scale: number ): number {
        return this._currentValue(propertyName) * scale;
    }

    private _currentValue( propertyName: Scalable ): number {
        return this.object[propertyName];
    }

    /**
     * mutates the object, so use a passed object rather than this.object
     */
    private _applyScale( object: OT, scale: number ): OT {
        this.scalableProperties.forEach(
            propertyName => object[propertyName] *= scale
        );
        return object;
    }

    getScaledValues( scale: number ): Required<Pick<OT, Scalable>> {
        const subset = _pick(this.object, this.scalableProperties);
        this.scalableProperties.forEach(
            propertyName => subset[propertyName] = this._getScaledValue(propertyName, scale)
        );
        return subset;
    }

    /**
     * SHOULD return with proper prototype, but may be buggy
     * see: https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
     * "It supports symbols but isn't perfect for getters/setters and isn't working with non-enumerable properties (see Object.assign() docs).
     */
    scale(scale: number): OT {
        const clone: OT = Object.assign( Object.create( Object.getPrototypeOf(this.object)), this.object);
        return this._applyScale(clone, scale);
    }

    calcScalePropertyToValue(basisProperty: Scalable, basisValue: number ): number {
        const currentValue = this._currentValue(basisProperty);
        return basisValue / currentValue;
    }

    scalePropertyToValue( propertyName: Scalable, value: number ): OT {
        const scale = this.calcScalePropertyToValue( propertyName, value );
        return this.scale( scale );
    }

    /**
     * for scaling width based on height, etc.
     */
    getScaledProperty( propertyName: Scalable, basisProperty: Scalable, basisValue: number ): number {
        const scale = this.calcScalePropertyToValue( basisProperty, basisValue );
        return this._getScaledValue( propertyName, scale );
    }

    calcScalePropertyToRange( propertyName: Scalable, range: NumericRange ): number {
        const currentValue = this._currentValue(propertyName);
        console.log( `value ${propertyName} must be in range ${range.min} to ${range.max} and is currently ${currentValue}`);
        if ( ! range.contains( currentValue ) ) {
            const value = range.constrain( currentValue );
            return this.calcScalePropertyToValue( propertyName, value );
        } else {
            //if value is already acceptable, make no changes
            return 1;
        }
    }

    scalePropertyToRange( propertyName: Scalable, range: NumericRange ): OT {
        const scale = this.calcScalePropertyToRange(propertyName, range);
        return this.scale(scale);
    }

    /**
     * @param {object} limits is an object where the keys are the property names and the values are the maximum value for that property
     */

    scaleToFit(limits: Limits<Scalable, OT> ): OT {
        return this.scale( this.calcScaleToMaximize( limits ) );
    }

    calcScaleToMaximize( propertyMaximums: Limits<Scalable, OT> ): number {
        //in order to meet all conditions, we want the MINIMUM
        return Math.min( ...this._getScalesFromLimits( propertyMaximums ) );
    }

    /**
     * @param {object} limits is an object where the keys are the property names and the values are the minimum value for that property
     */
    scaleToCover(limits: Limits<Scalable, OT> ): OT {
        return this.scale( this.calcScaleToMinimize( limits ) );
    }

    calcScaleToMinimize( propertyMinimums: Limits<Scalable, OT> ): number {
        //in order to meet all conditions, we want the MAXIMUM
        return Math.max( ...this._getScalesFromLimits( propertyMinimums ) );
    }

    private _getScalesFromLimits( limits: Limits<Scalable, OT> ): number[] {
        return Object.keys( limits ).map(
            propertyName => this.calcScalePropertyToValue( propertyName as Scalable, limits[propertyName] )
        );
    }
}

export default ScalableBase;
