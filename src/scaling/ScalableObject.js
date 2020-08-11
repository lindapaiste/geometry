import { getScreen, getWindow, WINDOW_WIDTH, WINDOW_HEIGHT } from "../../window/Dimensions";
import ScalableBase from "./ScalableBase";
//import Rectangle from "./Rectangle";

//any object with the properties width and height
//can be used for images, videos, divs, etc
//always preserves the aspect ratio
//always returns a new object and never mutates EXCEPT setWidth and setHeight

/** @class {Object} ScalableObject
 *
 * @property {number} width
 * @property {number} height
 * @property {number} aspectRatio
 */

//TODO: subscribe to changes in window size
export default class ScalableObject extends ScalableBase {
    scalableProperties = ['width', 'height'];

    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    //static constructor to allow for method chaining
    /**
     * @param object
     * @param {number} object.width
     * @param {number} object.height
     * @return {ScalableObject}
     */
    static fromObject(object) {
        return new this(object.width, object.height);
    }

    /**
     * @param {number} width
     * @param {number} height
     * @return {ScalableObject}
     */
    static fromValues(width, height) {
        return new this(width, height);
    }

    getRectangle() {
        //TODO: refactor usages
        //return new Rectangle(this.width, this.height, 0, 0);
    }

//---------------------------CALCULATIONS--------------------------//

    /**
     * @return {number}
     */
    get aspectRatio() {
        return this.width / this.height;
    }

    /**
     * @param {number} ratio
     * @return {boolean}
     */
    isAspectRatio(ratio) {
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
    calculateScale(width, height) {
        const maxWidth = width || WINDOW_WIDTH;
        const maxHeight = height || WINDOW_HEIGHT;
        return Math.min(maxWidth / this.width, maxHeight / this.height);
    }

    /**
     * @param {number} width
     * @param {number} height
     * @return {number}
     */
    calculateScaleToFit(width, height) {
        return this.maximize({ width, height });
    }

    /**
     * @param {number} width
     * @param {number} height
     * @return {number}
     */
    calculateScaleToCover(width, height) {
        return this.minimize({ width, height });
    }

    /**
     * @param {number} width
     * @return {number}
     */
    getScaledHeight(width) {
        return this.getScaledProperty( 'height', 'width', width );
    }

    /**
     * @param {number} height
     * @return {number}
     */
    getScaledWidth(height) {
        return this.getScaledProperty( 'width', 'height', height );
    }

//---------------------------SCALED COPIES--------------------------//

    /**
     * @param {number} width
     * @return {ScalableObject}
     */
    scaleToWidth(width) {
        return this.scalePropertyToValue('width', width);
    }

    /**
     * @param {number} height
     * @return {ScalableObject}
     */
    scaleToHeight(height) {
        return this.scalePropertyToValue('height', height);
    }

    /**
     * @param {?number} [width]
     * @param {?number} [height]
     * @return {ScalableObject}
     */
    scaleToMaxSize(width, height) {
        return this.maximize({width, height});
    }
}

export function scaleObjectToWindow(object) {
    return ScalableObject.fromObject(object).scaleToMaxSize();
}

export function getWindowScale(object) {
    return ScalableObject.fromObject(object).calculateScale();
}
