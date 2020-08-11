import {WINDOW_HEIGHT, WINDOW_WIDTH} from "../../window/Dimensions";
import {ScalableBaseCalc} from "./ScalableBaseCalc";
import {I_Sized} from "../sized/types";

//any object with the properties width and height
//can be used for images, videos, divs, etc
//always preserves the aspect ratio
//always returns a new object and never mutates EXCEPT setWidth and setHeight

/**
 * for the purposes of using composition over inheritance,
 * should just return the new scaled size rather than attempting to make a classed object
 */

/** @class {Object} ScalableObject
 *
 * @property {number} width
 * @property {number} height
 * @property {number} aspectRatio
 */

//TODO: subscribe to changes in window size
//TODO: window logic elsewhere?  or injected? but should not be a dependency
export default class ScalableObject {
    public readonly width: number;
    public readonly height: number;
    private calc: ScalableBaseCalc<'width' | 'height'>;

    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.calc = new ScalableBaseCalc({width, height});
    }

    //static constructor to allow for method chaining
    /**
     * @param {I_Sized} object
     * @return {ScalableObject}
     */
    static fromObject(object: I_Sized): ScalableObject {
        return new this(object.width, object.height);
    }

    /**
     * @param {number} width
     * @param {number} height
     * @return {ScalableObject}
     */
    static fromValues(width: number, height: number): ScalableObject {
        return new this(width, height);
    }

//---------------------------CALCULATIONS--------------------------//

    /**
     * @return {number}
     */
    get aspectRatio(): number | undefined {
        return (this.height === 0) ? undefined : this.width / this.height;
    }

    /**
     * @param {number} ratio
     * @return {boolean}
     */
    isAspectRatio(ratio: number): boolean {
        //need to allow some margin of error to account for rounding
        let expectedHeight = this.width / ratio;
        let difference = expectedHeight - this.height;
        return Math.abs(difference) <= 1;
    }

    /**
     * @param {?number} [width]
     * @param {?number} [height]
     * @return {number}
     */
    calculateScale(width: number | undefined, height: number | undefined): number {
        const maxWidth = width || WINDOW_WIDTH;
        const maxHeight = height || WINDOW_HEIGHT;
        return Math.min(maxWidth / this.width, maxHeight / this.height);
    }

    /**
     * @param {I_Sized} object
     * @return {number}
     */
    calculateScaleToFit(object: I_Sized): number {
        return this.calc.calcScaleToMaximize(object);
    }

    /**
     * @param {I_Sized} object
     * @return {number}
     */
    calculateScaleToCover(object: I_Sized): number {
        return this.calc.calcScaleToMinimize(object);
    }

    /**
     * @param {number} width
     * @return {number}
     */
    getScaledHeight(width: number): number {
        return this.calc.getScaledProperty('height', 'width', width);
    }

    /**
     * @param {number} height
     * @return {number}
     */
    getScaledWidth(height: number): number {
        return this.calc.getScaledProperty('width', 'height', height);
    }

//---------------------------SCALED SIZES--------------------------//

    public scale(scale: number): I_Sized {
        return {
            width: this.width * scale,
            height: this.height * scale,
        }
    }

    /**
     * @param {number} width
     * @return {I_Sized}
     */
    sizeForWidth(width: number): I_Sized {
        return this.scale(this.calc.calcScalePropertyToValue('width', width));
    }

    /**
     * @param {number} height
     * @return {I_Sized}
     */
    sizeForHeight(height: number): I_Sized {
        return this.scale(this.calc.calcScalePropertyToValue('height', height));
    }

    sizeToFit(object: I_Sized): I_Sized {
        return this.scale(this.calc.calcScaleToMaximize(object));
    }

    sizeToCover(object: I_Sized): I_Sized {
        return this.scale(this.calc.calcScaleToMinimize(object));
    }
}

//TODO export function scaleObjectToWindow<OT extends Sized>(object: OT): OT {}

//TODO export function getWindowScale(object) {}
