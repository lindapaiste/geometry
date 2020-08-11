import {I_NumericRange, I_Range} from "./types";

/**
 * use generics to define if the range is open-ended or not
 */
export class NumericRange<Min extends number | undefined, Max extends number | undefined> implements Partial<I_Range>, I_NumericRange {
    public readonly max: Max;
    public readonly min: Min;

    /**
     * a Range can be open on either or both ends
     * both min and max can be a number or undefined for an open-ended range
     * @param {number} [min] -- the range minimum
     * @param {number} [max] -- the range maximum
     */
    constructor( min: Min, max: Max ) {
        this.min = min;
        this.max = max;
    }
    /**
     * @return {boolean}
     */
    hasMin(): this is this & {min: number} {
        return this.min !== undefined;
    }

    /**
     * @return {boolean}
     */
    hasMax(): this is this & {max: number} {
        return this.max !== undefined;
    }

    /**
     * @return {boolean}
     */
    isDefined(): this is this & I_Range {
        return this.hasMin() && this.hasMax();
    }

    /** boolean of whether the given number is inside the range
     *
     * @param {number} value
     * @return {boolean}
     */
    contains( value: number ): boolean {
        return ! ( this.isTooLarge(value) || this.isTooSmall(value) );
    }

    /** boolean of whether the given number is too large to fit inside the range
     *
     * @param {number} value
     * @return {boolean}
     */
    isTooLarge( value: number ): boolean {
        return ( this.hasMax() && value > this.max );
    }

    /** boolean of whether the given number is too small to fit inside the range
     *
     * @param {number} value
     * @return {boolean}
     */
    isTooSmall( value: number ): boolean {
        return ( this.hasMin() && value < this.min );
    }

    /** force values that are outside the range into the nearest edge
     *
     * @param {number} value
     * @return {number}
     */
    constrain( value: number ): number {
        if ( this.hasMin() ) {
            value = Math.max( value, this.min );
        }
        if ( this.hasMax() ) {
            value = Math.min( value, this.max );
        }
        return value;
    }

    /**
     * helper for union and intersection, determines whether there is any overlap between the ranges
     *
     * @param {Range} range
     * @return boolean
     */
    hasOverlap( range: I_NumericRange ): boolean {
        //no overlap when this.max < range.min or this.min > range.max
        return ! ( ( this.hasMax() && range.hasMin() && this.max < range.min )
        || ( this.hasMin() && range.hasMax() && this.min > range.max ) );
    }

    /** returns a new Range representing the intersection of the given the range and the current range
     * or null if there is no overlap
     *
     * @param {Range} range
     * @return {Range|null}
     */
    intersection( range: I_NumericRange ): I_NumericRange | null {
        if ( ! this.hasOverlap(range) ) return null;
        //cannot use constrain function on undefined values
        const min = ( range.hasMin() ) ? this.constrain( range.min ) : this.min;
        const max = ( range.hasMax() ) ? this.constrain( range.max ) : this.max;
        return new NumericRange( min, max );
    }

    /** returns a new Range representing the union of the given the range and the current range
     * or null if the ranges do not overlap
     *
     * @param {Range} range
     * @return {Range|null}
     */
    union( range: I_NumericRange ): I_NumericRange | null {
        if ( ! this.hasOverlap(range) ) return null;
        //if either value is undefined, then the result is open ended
        const min = ( range.hasMin() && this.hasMin() ) ? Math.min( range.min, this.min ) : undefined;
        const max = ( range.hasMax() && this.hasMax() ) ? Math.max( range.max, this.max ) : undefined;
        return new NumericRange( min, max );
    }
}
//is both named and default export
export default NumericRange;
