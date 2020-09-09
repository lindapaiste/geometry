import RectanglePoint from "./points/RectanglePoint";
import {RectangleValues} from "./types";
import XYRange from "../range/XYRange";
import {
    CENTER,
    CenterPoint,
    CornerPoint,
    CORNERS,
    IPointName,
    IRectanglePoint,
    isCenter,
    isMidpoint,
    isXName,
    MidPoint,
    MIDPOINTS,
    midpointToSide,
    oppositeName,
    oppositePointName,
    PointNameTuple,
    Side,
    XName,
    YName
} from "./points";
import {coordsToRect, makeCompleteRectangle, rectToCoords, toCoordinates, toRectangleProps} from "./convert";
import {Coordinates, HasCoordinates, Rectangle, Sized, XY} from "../coreTypes";
import {HasRangesXY} from "../range";

/**
 * has all of the same editing functions, but always returns a new object
 */
export default class ImmutableRectangle implements XY, Sized, Coordinates, HasCoordinates, Rectangle, RectangleValues, HasRangesXY {
    public readonly range: XYRange;

    /**
     * for the most part, it does not matter which set are values are stored internally
     * and which come from accessors, though accessor values aren't included with the spread operator
     *
     * this class implements the interfaces for x1/x2/y1/y2 and x/y/width/height
     */
    public readonly x1: number;
    public readonly x2: number;
    public readonly y1: number;
    public readonly y2: number;

    public static readonly scalableProperties = ["height", "width"];

// ----------------------------CREATION--------------------------//

    constructor(props: Partial<Rectangle>) {
        const {x1, x2, y1, y2} = rectToCoords(makeCompleteRectangle(props));
        this.x1 = props.x || 0;
        this.y1 = props.y || 0;
        this.x2 = this.x1 + (props.width || 0);
        this.y2 = this.y1 + (props.height || 0);
        this.range = new XYRange(this);
    }

    clone(): ImmutableRectangle {
        // return new this(this.width, this.height, this.x, this.y);
        return new ImmutableRectangle(this);
    }

    static fromObject(object: Rectangle): ImmutableRectangle {
        return new this(object);
    }

    static fromCoordinates(object: Coordinates): ImmutableRectangle {
        return new this(coordsToRect(object));
    }

    /**
     * helper creates a copy with some properties changed from the IRectangle interface, eg. x, y, width, or height.
     */
    private _alteredProps = (props: Partial<Rectangle>): ImmutableRectangle => {
        return new ImmutableRectangle({
            ...this.props,
            ...props,
        });
    };

    /**
     * helper creates a copy with some coordinates changed, eg. x1, x2, y1, y2.
     */
    private _alteredCoords = (coords: Partial<Coordinates>): ImmutableRectangle => {
        return ImmutableRectangle.fromCoordinates({
            ...this.coordinates,
            ...coords,
        });
    };

// ----------------------------GET ALIASED & COMPUTED VALUES--------------------------//

    get x(): number {
        return this.x1;
    }

    get y(): number {
        return this.y1;
    }

    get width(): number {
        return this.x2 - this.x1;
    }

    get height(): number {
        return this.y2 - this.y1;
    }

    get xmid(): number {
        return this.x + 0.5 * this.width;
    }

    get ymid(): number {
        return this.y + 0.5 * this.height;
    }

    get aspectRatio(): number | undefined {
        return this.height === 0 ? undefined : this.width / this.height;
    }

    get rangeX() {
        return this.range.rangeX;
    }

    get rangeY() {
        return this.range.rangeY;
    }

    /**
     * use this with spread operator, since get() properties aren't included in spread
     */
    get props(): Rectangle {
        return toRectangleProps(this);
    }

    get area(): number {
        return this.width * this.height;
    }

// ----------------------------GET POINTS--------------------------//

    get center(): RectanglePoint & CenterPoint {
        return this.getPoint(CENTER);
    }

    get corners(): (RectanglePoint & CornerPoint)[] {
        return CORNERS.map(this.getPoint);
    }

    get midpoints(): (RectanglePoint & MidPoint)[] {
        // note: as is needed here because using Pick on a union type leads to types outside of the union
        return MIDPOINTS.map(this.getPoint) as (RectanglePoint & MidPoint)[];
    }

    get coordinates(): Coordinates {
        return toCoordinates(this);
    }

// ----------------------------MOVING--------------------------//

    /**
     * Root shift method an apply a change in both the x and y directions
     */
    shift = ({x = 0, y = 0}: Partial<XY>): ImmutableRectangle => {
        return this._alteredProps({
            x: this.x + x,
            y: this.y + y
        });
    };
    /**
     * moves along the x-axis without changing size
     */
    shiftX = (change: number): ImmutableRectangle => {
        return this.shift({x: change});
    };
    /**
     * moves along the y-axis without changing size
     */
    shiftY = (change: number): ImmutableRectangle => {
        return this.shift({y: change});
    };
    /**
     * shift a particular x property (x1, x2, xmid) to a new value
     */
    shiftToX = (value: number, fixedProperty: XName = "x1"): ImmutableRectangle => {
        const current = this[fixedProperty];
        return this.shiftX(value - current);
    };
    /**
     * shift a particular y property (y1, y2, ymid) to a new value
     */
    shiftToY = (value: number, fixedProperty: YName = "y1"): ImmutableRectangle => {
        const current = this[fixedProperty];
        return this.shiftY(value - current);
    };
    /**
     * Shifts the rectangle such that it includes the given named point with the given values.
     */
    shiftToPoint = (point: IRectanglePoint): ImmutableRectangle => {
        const current = this.getPoint(point);
        return this.shift({
            x: point.x - current.x,
            y: point.y - current.y
        });
    };
    /**
     * Shift the center point of a rectangle. A specific instance of shiftToPoint.
     */
    setCenter = (point: XY): ImmutableRectangle => {
        return this.shiftToPoint({...point, ...CENTER});
    };

// ----------------------------SCALING--------------------------//

    /**
     * The scale value determines the width and height of the new rectangle. Pass in an fixedPoint name and use that
     * point to determine the x and y positions of the new rectangle such that the fixedPoint keeps its same position.
     * If no point is passed, defaults to moving from the center
     */
    scale = (float: number, fixedPoint: IPointName = CENTER): ImmutableRectangle => {
        // create a new rectangle of the right size and move it such that it shares the fixed point
        return this._alteredProps({
            width: this.width * float,
            height: this.height * float,
        }).shiftToPoint(this.getPoint(fixedPoint));
    };

    /**
     * Scales such that the width matches the passed value while preserving the current aspect ratio
     */
    scaleToWidth = (width: number, fixedPoint?: IPointName): ImmutableRectangle => {
        const float = width / this.width;
        return this.scale(float, fixedPoint);
    };

    /**
     * Scales such that the height matches the passed value while preserving the current aspect ratio
     */
    scaleToHeight = (height: number, fixedPoint?: IPointName): ImmutableRectangle => {
        const float = height / this.height;
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
    scaleToSide = (value: number, side: Side, fixedPoint: IPointName = CENTER): ImmutableRectangle => {
        const current = this[side];
        const opposite = this[oppositeName(side)];
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
    scaleToPoint = (point: IRectanglePoint): ImmutableRectangle => {
        if (isCenter(point)) {
            return this;
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
            const scaleX = stretched.width / this.width;
            const scaleY = stretched.height / this.height;
            const scale = (scaleX + scaleY) / 2;
            return this.scale(scale, fixedPoint);
        }
    };

// ----------------------------STRETCHING--------------------------//

    /**
     * Change the width, height, or both, but keep a specific fixedPoint at the same position
     */
    stretch = (size: Partial<Sized>, fixedPoint: IPointName = CENTER): ImmutableRectangle => {
        const {width = this.width, height = this.height} = size;
        return this._alteredProps({width, height})
            .shiftToPoint(this.getPoint(fixedPoint));
    }

    /**
     * Change the width without making any changes to y or height. The placement of the rectangle on the x-axis is
     * determined by prop "fixedProperty." Can stretch from the left or right, but default to center.
     */
    stretchToWidth = (width: number, fixedProperty: XName = "xmid"): ImmutableRectangle => {
        /**
         * set the width, then shift so that the fixedProperty is back to the preserved current value
         */
        const current = this[fixedProperty];
        return this._alteredProps({width})
            .shiftToX(current, fixedProperty);
    };

    /**
     * Change the height without making any changes to x or width. The placement of the rectangle on the y-axis is
     * determined by prop "fixedProperty." Can stretch from the top or bottom, but default to center.
     */
    stretchToHeight = (height: number, fixedProperty: YName = "ymid"): ImmutableRectangle => {
        const current = this[fixedProperty];
        return this._alteredProps({height})
            .shiftToY(current, fixedProperty);
    };

    /**
     * Alter a rectangle such that it has the desired aspect ratio.  This can be done by changing just the height, just
     * the width, or both.  Determine which to change and which to keep through prop "preserve" which accepts values
     * "width" (change the height), "height" (change the width), or "area" (change both height and width, but keep the
     * same area).  Defaults to "area."
     *
     * The position of the newly-sized rectangle is based on prop "fixedPoint", which defaults to the center.
     */
    stretchToRatio = (ratio: number, preserve?: "width" | "height" | "area", fixedPoint: IPointName = CENTER): ImmutableRectangle => {
        if (preserve === "width") {
            return this.stretchToHeight(this.width / ratio, fixedPoint.yName);
        } else if (preserve === "height") {
            return this.stretchToWidth(this.height * ratio, fixedPoint.xName);
        } else {
            /**
             * to preserve area, calculate the new width and height
             * make a new rectangle with these values and shift it to the fixed point
             */
            const width = Math.sqrt(ratio * this.area);
            const height = Math.sqrt(this.area / ratio);
            return new ImmutableRectangle({width, height})
                .shiftToPoint(
                    this.getPoint(fixedPoint)
                );
        }
    };

    /**
     * Repositions a corner of the rectangle while keeping the opposite corner the same.
     */
    stretchToCorner = (point: IRectanglePoint & CornerPoint): ImmutableRectangle => {
        return this._alteredCoords({
            [point.xName]: point.x,
            [point.yName]: point.y,
        });
    }

    /**
     * Alters value x1, x2, y1, or y2 while keeping everything else the same. Essentially a setter.
     */
    stretchToSide = (value: number, side: Side): ImmutableRectangle => {
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
    stretchToPoint = (point: IRectanglePoint): ImmutableRectangle => {
        return ImmutableRectangle.fromCoordinates({
            ...this.coordinates,
            [point.xName]: point.x,
            [point.yName]: point.y,
        });
    };

// -------------------------ACCESSING NAMED POINTS--------------------------//

    /**
     * want to make sure that the retrieved point inherits the specific point type of the name, eg. MidPoint,
     * CornerPoint, or CenterPoint
     */
    getPoint = <T extends IPointName>(point: T): Pick<T, 'xName' | 'yName'> & RectanglePoint => {
        const {xName, yName} = point;
        return new RectanglePoint({
            xName,
            yName,
            x: this[xName],
            y: this[yName]
        });
    };

    /**
     * get a rectangle point from the x and y names
     */
    getPointFromNames = (xName: XName, yName: YName): RectanglePoint => {
        return this.getPoint({xName, yName});
    };

    /**
     * creates a shortcut when working with enums
     */
    getPointFromTuple = (pair: PointNameTuple): RectanglePoint => {
        return this.getPointFromNames(pair[0], pair[1]);
    };

    /**
     * get the point that is opposite to the passed in point or point name.
     */
    getOppositePoint = (point: IPointName): RectanglePoint => {
        return this.getPoint(oppositePointName(point));
    };

// -------------------------CONTAINED VALUES--------------------------//

    /**
     * Force a point to be contained in the rectangle
     */
    constrain = <T extends XY>(point: T): T => {
        return this.range.constrain(point);
    };

    /**
     * Returns true if the point is inside the rectangle OR on the border
     */
    contains = (point: XY): boolean => {
        return this.range.contains(point);
    };

    isOnBorder = (point: XY): boolean => {
        // what about a margin?
        if (!this.contains(point)) {
            return false;
        }
        return point.x === this.x1 || point.x === this.x2 || point.y === this.y1 || point.y === this.y2;
    }

}
/**
 * this check isn't entirely necessary because it will work fine to always construct a new class,
 * but this function will return the existing class if it's already a class rather than constructing a new instance.
 */
export const toRectangleClass = (obj: Partial<Rectangle>): ImmutableRectangle => {
    if (obj instanceof ImmutableRectangle) {
        return obj;
    } else {
        return new ImmutableRectangle(obj);
    }
}
