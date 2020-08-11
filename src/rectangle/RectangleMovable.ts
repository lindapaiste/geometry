import MutableRectangle from "./MutableRectangle";
import {WritableKeys} from "../../../../../gutenberg/src/typescript/keys";
/**
 * alternate version where the width and the height are fixed
 * setting x2/y2 causes the rectangle to move, but not change size or shape
 *
 * use JS proxy syntax to avoid duplication
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 */
export const fixedSizeHandler: ProxyHandler<MutableRectangle> = {
    set: function(target: MutableRectangle, property: WritableKeys<MutableRectangle>, value) {
        /**
         * could special case the mutating properties, which are x1, x2, y1, y2, width, height
         *
         * can also set the property in the target and then set the width and height back to what it was before
         * but this requires refactoring of base class because width/height change both x1 and x2,
         * so it won't return the right value
         *
         * can return false on width and height to throw a TypeError, or just do nothing
         */
        switch ( property ) {
            case 'width':
            case 'height':
                return false;
            case 'x1':
            case 'x2':
                target.shiftX(value - target[property]);
                return true;
            case 'y1':
            case 'y2':
                target.shiftY(value - target[property]);
                return true;
            default:
                //passed through properties
                target[property] = value;
                return true;

        }
    },

    //apply: function(target, thisArg, argumentsList) {},
};

/**
 * can construct in two ways: either make a rectangle first and apply the handler to it,
 * or create a construct function in the handler: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/construct
 */

export const freezeSize = ( rectangle: MutableRectangle ) => {
    return new Proxy( rectangle, fixedSizeHandler );
};
