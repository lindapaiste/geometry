export default class ScalableBase {
    scalableProperties = [];

    _applyScale( scale ) {
        this.scalableProperties.forEach(
            key => this[key] *= scale
        );
    }

    _clone() {
        return Object.assign( new this.constructor(), this );
    }

    _getScaledValue( propertyName, scale ) {
        return this[propertyName] * scale;
    }

    scale(scale) {
        const clone = this._clone();
        clone._applyScale(scale);
        return clone;
    }

    calculateScaleForProperty( basisProperty, basisValue ) {
        const currentValue = this[basisProperty];
        return basisValue / currentValue;
    }

    getScaledProperty( propertyName, basisProperty, basisValue ) {
        const scale = this.calculateScaleForProperty( basisProperty, basisValue );
        return this._getScaledValue( propertyName, scale );
    }

    scalePropertyToValue( propertyName, value ) {
        const scale = this.calculateScaleForProperty( propertyName, value );
        return this.scale( scale );
    }

    scalePropertyToRange( propertyName, range ) {
        const currentValue = this[propertyName];
        console.log( `value ${propertyName} must be in range ${range.min} to ${range.max} and is currently ${currentValue}`);
        if ( ! range.contains( currentValue ) ) {
            const value = range.constrain( currentValue );
            return this.scalePropertyToValue( propertyName, value );
        } else {
            //if value is already acceptable, make no changes
            return this;
        }
    }

    /**
     * @param {object} limits is an object where the keys are the property names and the values are the maximum value for that property
     */
    maximize( limits ) {
        return this.scale( this.getScaleToMaximize( limits ) );
    }

    getScaleToMaximize( limits ) {
        //in order to meet all conditions, we want the MINIMUM
        return Math.min( ...this._getScalesFromLimits( limits ) );
    }

    /**
     * @param {object} limits is an object where the keys are the property names and the values are the minimum value for that property
     */
    minimize( limits ) {
        return this.scale( this.getScaleToMinimize( limits ) );
    }

    getScaleToMinimize( limits ) {
        //in order to meet all conditions, we want the MAXIMUM
        return Math.max( ...this._getScalesFromLimits( limits ) );
    }

    _getScalesFromLimits( limits ) {
        return Object.keys( limits ).map(
            propertyName => this.calculateScaleForProperty( propertyName, limits[propertyName] )
        );
    }
}