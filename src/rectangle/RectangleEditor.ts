import RectanglePoint from "./points/RectanglePoint";
import {
    CENTER,
    CornerPoint,
    IPointName,
    IRectanglePoint,
    isCenter,
    isMidpoint,
    isXName,
    midpointToSide,
    oppositeName,
    oppositePointName,
    Side,
    XName,
    YName
} from "./points";
import {coordsToRect} from "./convert";
import {Coordinates, Rectangle, Sized, XY} from "../coreTypes";
import RectangleAccessor from "./RectangleAccessor";
import {translation} from "../points";

/**
 * internally stores a minimal RectangleAccessor
 *
 * methods return a new RectangleAccessor
 *
 * can no longer chain methods
 *
 * alternatively, can have three base functions on the rectangle (shift, scale, stretch) and use the RectangleEditor to
 * create more specific instances and call with props
 */
export default class RectangleEditor {

    public readonly r: RectangleAccessor;

// ----------------------------CREATION--------------------------//

    constructor(props: Partial<Rectangle>) {
        this.r = new RectangleAccessor(props);
    }

    /**
     * helper creates a copy with some properties changed from the IRectangle interface, eg. x, y, width, or height.
     */
    private _alteredProps = (props: Partial<Rectangle>): RectangleAccessor => {
        return new RectangleAccessor({
            ...this.r.props,
            ...props,
        });
    };

    /**
     * helper creates a copy with some coordinates changed, eg. x1, x2, y1, y2.
     */
    private _alteredCoords = (coords: Partial<Coordinates>): RectangleAccessor => {
        return new RectangleAccessor(coordsToRect({
            ...this.r.coordinates,
            ...coords,
        }));
    };

// ----------------------------ACCESS--------------------------//

    /**
     * get the current value of a property on the rectangle
     */
    private current = (name: XName | YName | keyof Sized | "area" | "aspectRatio"): number => {
        return this.r[name];
    }

    /**
     * want to make sure that the retrieved point inherits the specific point type of the name, eg. MidPoint,
     * CornerPoint, or CenterPoint
     */
    private getPoint = <T extends IPointName>(point: T): Pick<T, 'xName' | 'yName'> & RectanglePoint => {
        return this.r.getPoint(point);
    };

    /**
     * can no longer method chain, so use this helper instead
     * takes an altered rectangle along with the name of the point to preserve
     * and shifts the altered rectangle such that that it shares the named point with the internally stored rectangle
     */
    private resetPoint = (altered: RectangleAccessor, fixedPoint: IPointName = CENTER): RectangleAccessor => {
        const shift = translation(altered.getPoint(fixedPoint), this.getPoint(fixedPoint));
        return this._alteredProps({
            width: altered.width,
            height: altered.height,
            x: altered.x + shift.x,
            y: altered.y + shift.y,
        })
    }

// ----------------------------MOVING--------------------------//

    /**
     * Root shift method an apply a change in both the x and y directions
     */
    shift = ({x = 0, y = 0}: Partial<XY>): RectangleAccessor => {
        return this._alteredProps({
            x: this.r.x + x,
            y: this.r.y + y
        });
    };
    /**
     * moves along the x-axis without changing size
     */
    shiftX = (change: number): RectangleAccessor => {
        return this.shift({x: change});
    };
    /**
     * moves along the y-axis without changing size
     */
    shiftY = (change: number): RectangleAccessor => {
        return this.shift({y: change});
    };
    /**
     * shift a particular x property (x1, x2, xmid) to a new value
     */
    shiftToX = (value: number, fixedProperty: XName = "x1"): RectangleAccessor => {
        return this.shiftX(value - this.current(fixedProperty));
    };
    /**
     * shift a particular y property (y1, y2, ymid) to a new value
     */
    shiftToY = (value: number, fixedProperty: YName = "y1"): RectangleAccessor => {
        return this.shiftY(value - this.current(fixedProperty));
    };
    /**
     * Shifts the rectangle such that it includes the given named point with the given values.
     */
    shiftToPoint = (point: IRectanglePoint): RectangleAccessor => {
        const current = this.getPoint(point);
        return this.shift(translation(point, current));
    };

    /**
     * Shift the center point of a rectangle. A specific instance of shiftToPoint.
     */
    setCenter = (point: XY): RectangleAccessor => {
        return this.shiftToPoint({...point, ...CENTER});
    };

// ----------------------------SCALING--------------------------//

    /**
     * The scale value determines the width and height of the new rectangle. Pass in an fixedPoint name and use that
     * point to determine the x and y positions of the new rectangle such that the fixedPoint keeps its same position.
     * If no point is passed, defaults to moving from the center
     */
    scale = (float: number, fixedPoint: IPointName = CENTER): RectangleAccessor => {
        // create a new rectangle of the right size and move it such that it shares the fixed point
        return this.resetPoint(
            this._alteredProps({
                width: this.r.width * float,
                height: this.r.height * float,
            }),
            fixedPoint
        );
    };

    /**
     * Scales such that the width matches the passed value while preserving the current aspect ratio
     */
    scaleToWidth = (width: number, fixedPoint?: IPointName): RectangleAccessor => {
        const float = width / this.r.width;
        return this.scale(float, fixedPoint);
    };

    /**
     * Scales such that the height matches the passed value while preserving the current aspect ratio
     */
    scaleToHeight = (height: number, fixedPoint?: IPointName): RectangleAccessor => {
        const float = height / this.r.height;
        return this.scale(float, fixedPoint);
    };

    /**
     * Set x1, x2, y1, or y2 and adjust the opposite dimension such that the aspect ratio is preserved.
     *
     * Defaults to scaling from the center of the rectangle for consistency with other methods. This will cause x1 to
     * be changed when scaling to an x2 value, etc. Will often want to scale from the center of the opposite side, and
     * can pass a fixedPoint if top or bottom is preferred. Not all values of fixedPoint make sense, such as scaling
     * from a point on the side which is being scaled to.
     */
    scaleToSide = (value: number, side: Side, fixedPoint: IPointName = CENTER): RectangleAccessor => {
        const current = this.current(side);
        const opposite = this.current(oppositeName(side));
        // doesn't need Math.abs because if subtracting x1 - x2, both will be negative and the result positive (unless
        // negative width)
        const scale = (value - opposite) / (current - opposite);
        return this.scale(scale, fixedPoint);
    };

    /**
     * This method involves arbitrary decision-making because it is often not possible to hit the target point exactly
     * while maintaining the aspect ratio and also maintaining the position of the opposite point.
     *
     * These decisions are as follows:
     * - center points change nothing
     * - corners average the x and y changes, relative to the aspect ratio
     * - midpoints only look at the changes to the position of the side, while ignoring changes to xmid/ymid and
     * keeping the xmid/ymid from the fixed opposite point
     */
    scaleToPoint = (point: IRectanglePoint): RectangleAccessor => {
        if (isCenter(point)) {
            return this.r;
        }
        const fixedPoint = oppositePointName(point);

        if (isMidpoint(point)) {
            const side = midpointToSide(point);
            const value = isXName(side) ? point.x : point.y;
            return this.scaleToSide(value, side, fixedPoint);
        } else {
            // isCorner
            /**
             * look at the stretched rectangle to get the scale in both directions and apply the average of the two
             */
            const stretched = this.stretchToPoint(point);
            const scaleX = stretched.width / this.r.width;
            const scaleY = stretched.height / this.r.height;
            const scale = (scaleX + scaleY) / 2;
            return this.scale(scale, fixedPoint);
        }
    };

// ----------------------------STRETCHING--------------------------//

    /**
     * Change the width, height, or both, but keep a specific fixedPoint at the same position
     */
    stretch = ({width, height}: Partial<Sized>, fixedPoint: IPointName = CENTER): RectangleAccessor => {
        return this.resetPoint(
            this._alteredProps({
                width: width || this.current("width"),
                height: height || this.current("height")
            }),
            fixedPoint
        )
    }

    /**
     * Change the width without making any changes to y or height. The placement of the rectangle on the x-axis is
     * determined by prop "fixedProperty." Can stretch from the left or right, but default to center.
     */
    stretchToWidth = (width: number, fixedProperty: XName = "xmid"): RectangleAccessor => {
        // y value of fixedPoint should not matter since none are changed
        return this.stretch({width}, {xName: fixedProperty, yName: "ymid"});
    };

    /**
     * Change the height without making any changes to x or width. The placement of the rectangle on the y-axis is
     * determined by prop "fixedProperty." Can stretch from the top or bottom, but default to center.
     */
    stretchToHeight = (height: number, fixedProperty: YName = "ymid"): RectangleAccessor => {
        return this.stretch({height}, {xName: "xmid", yName: fixedProperty});
    };

    /**
     * Alter a rectangle such that it has the desired aspect ratio.  This can be done by changing just the height, just
     * the width, or both.  Determine which to change and which to keep through prop "preserve" which accepts values
     * "width" (change the height), "height" (change the width), or "area" (change both height and width, but keep the
     * same area).  Defaults to "area."
     *
     * The position of the newly-sized rectangle is based on prop "fixedPoint", which defaults to the center.
     */
    stretchToRatio = (ratio: number, preserve: "width" | "height" | "area" = "area", fixedPoint: IPointName = CENTER): RectangleAccessor => {
        let size;
        if (preserve === "width") {
            const width = this.current("width");
            size = {
                width,
                height: width / ratio,
            }
        } else if (preserve === "height") {
            const height = this.current("height");
            size = {
                height,
                width: height * ratio,
            }
        } else {
            /**
             * to preserve area, calculate the new width and height
             * make a new rectangle with these values and shift it to the fixed point
             */
            const area = this.current("area");
            size = {
                width: Math.sqrt(ratio * area),
                height: Math.sqrt(area / ratio),
            }
        }
        return this.stretch(size, fixedPoint);
    };

    /**
     * Repositions a corner of the rectangle while keeping the opposite corner the same.
     */
    stretchToCorner = (point: IRectanglePoint & CornerPoint): RectangleAccessor => {
        return this._alteredCoords({
            [point.xName]: point.x,
            [point.yName]: point.y,
        });
    }

    /**
     * Alters value x1, x2, y1, or y2 while keeping everything else the same. Essentially a setter.
     */
    stretchToSide = (value: number, side: Side): RectangleAccessor => {
        return this._alteredCoords({
            [side]: value,
        });
    };

    /**
     * Moves a corner or midpoint of the rectangle to a new position, while keeping the opposite point the same.
     * Alters the size and shape of the rectangle.
     *
     * This makes logical sense for corners, as it is just repositioning two of the coordinates.
     *
     * Has no effect at all on center.
     *
     * With midpoints, it is not possible to set to the exact point without also changing the opposite point, because
     * they will have the same xmid/ymid value.  Stretching to the new xmid/ymid is not possible without specifying
     * whether to use x1 or x2 as the basis.  Therefore I am making the arbitrary decision that the xmid/ymid value
     * will be ignored, and only the value of the side will be applied.
     */
    stretchToPoint = (point: IRectanglePoint): RectangleAccessor => {
        return this._alteredCoords({
            [point.xName]: point.x,
            [point.yName]: point.y,
        });
    };

}
