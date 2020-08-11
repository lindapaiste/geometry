import RectanglePoint from '../rectanglePoints/RectanglePoint';
import {CENTERS, CenterPoint, MidPoint, Side, SIDES, XNames, YNames} from "../rectanglePoints/enums";
import {ICoordinates, IRectangle} from "./types";
import XYRange from "../range/XYRange";
import {IXYRangeMethods} from "../range/types";
import {CENTER_POINT, CORNERS, MIDPOINTS, PointNameTuple} from "../rectanglePoints/name-tuples";
import {IPoint, IPointName, IRectanglePoint, ISized} from "..";
import {oppositeName, oppositePointName} from "../rectanglePoints/opposites";
import {isCenter, isCenterX, isMidpoint} from "../rectanglePoints/booleans";
import {midpointSide, sideMidpoint} from "../rectanglePoints/midpointsSides";

/**
 * has all of the same editing functions, but always returns a new object
 */
export default class ImmutableRectangle implements IPoint, ISized, ICoordinates, IRectangle, IXYRangeMethods {

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

    public static readonly scalableProperties = ['height', 'width'];

// ----------------------------CREATION--------------------------//

    constructor(props: Partial<IRectangle>) {
        this.x1 = props.x || 0;
        this.y1 = props.y || 0;
        this.x2 = this.x1 + (props.width || 0);
        this.y2 = this.y1 + (props.height || 0);
        this.range = new XYRange(this);
    }

    clone(): ImmutableRectangle {
        // return new this(this.width, this.height, this.x, this.y);
        return new ImmutableRectangle(this);
    };

    static fromObject(object: IRectangle): ImmutableRectangle {
        return new this(object);
    }

    static fromCoordinates(object: ICoordinates): ImmutableRectangle {
        return new this({
            x: object.x1,
            y: object.y1,
            width: object.x2 - object.x1,
            height: object.y2 - object.y1,
        });
    }

    /**
     * helper creates a copy with some properties changed
     */
    private altered = (props: Partial<IRectangle>): ImmutableRectangle => {
        return new ImmutableRectangle({
            ...this.props,
            ...props
        });
    }

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
        return this.x + .5 * this.width;
    }

    get ymid(): number {
        return this.y + .5 * this.height;
    }

    get aspectRatio(): number | undefined {
        return (this.height === 0) ? undefined : this.width / this.height;
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
    get props(): IRectangle {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        }
    }

    get area(): number {
        return this.width * this.height;
    }

    /**
     * true if the rectangle is wider than it is tall
     */
    get isHorizontal(): boolean {
        return this.height < this.width;
    }

    /**
     * true if the rectangle is taller than it is wide
     */
    get isVertical(): boolean {
        return this.height > this.width;
    }

    /**
     * true if the two sides are exactly equal
     */
    get isSquare(): boolean {
        return this.height === this.width;
    }

// ----------------------------GET POINTS--------------------------//

    get center() {
        return this.getPointFromTuple(CENTER_POINT) as RectanglePoint & CenterPoint;
    }

    get corners() {
        return Object.values(CORNERS).map(pair => this.getPointFromTuple(pair)) as (RectanglePoint & CenterPoint)[];
    }

    get midpoints() {
        return Object.values(MIDPOINTS).map(pair => this.getPointFromTuple(pair)) as (RectanglePoint & MidPoint)[];
    }

    get coordinates(): ICoordinates {
        return {
            x1: this.x1,
            x2: this.x2,
            y1: this.y1,
            y2: this.y2,
        }
    }

// ----------------------------MOVING--------------------------//

    /**
     * moves along the x-axis without changing size
     */
    shiftX = (change: number): ImmutableRectangle => {
        return this.altered({
            x: this.x + change,
        });
    };
    /**
     * moves along the y-axis without changing size
     */
    shiftY = (change: number): ImmutableRectangle => {
        return this.altered({
            y: this.y + change,
        });
    };
    /**
     * shift a particular x property (x1, x2, xmid) to a new value
     */
    shiftToX = (value: number, fixedProperty: XNames): ImmutableRectangle => {
        const current = this[fixedProperty];
        return this.shiftX(value - current);
    };
    shiftToY = (value: number, fixedProperty: YNames): ImmutableRectangle => {
        const current = this[fixedProperty];
        return this.shiftY(value - current);
    };
    shift = (changeX: number = 0, changeY: number = 0): ImmutableRectangle => {
        return this.shiftX(changeX).shiftY(changeY);
    };
    /**
     * need to use a separate function and not just a setter in order to accept a
     * type that is different than the return type of a classes RectanglePoint
     */
    setCenter = (point: IPoint): ImmutableRectangle => {
        return this.shiftToPoint({...point, xName: CENTERS.X, yName: CENTERS.Y});
    };

    /**
     * keeps the height and width the same, but shifts the rectangle such that it includes the given named point
     */
    shiftToPoint = (point: IRectanglePoint): ImmutableRectangle => {
        const current = this.getPointFromNames(point.xName, point.yName);
        return this.shift(point.x - current.x, point.y - current.y);
    };

// ----------------------------SCALING--------------------------//

    /**
     * scaling determines the width and height values
     * pass in an I_RectanglePoint and use that point to determine the x and y
     * create a new rectangle of the right size and moves it such that it shares that point
     *
     * if no point is passed, defaults to moving from the center
     *
     * this function is a lot simpler with immutable objects because
     * each value can be dealt with individually without any changes to the others
     */
    scale = (float: number, fixedPoint: IPointName = this.center): ImmutableRectangle => {
        return this.altered({
            width: this.width * float,
            height: this.height * float,
        }).shiftToPoint(this.getPoint(fixedPoint));
    };

    /**
     * scales such that the width matches the passed value
     * while preserving the current aspect ratio
     */
    scaleToWidth = (width: number, fixedPoint?: IPointName): ImmutableRectangle => {
        const float = width / this.width;
        return this.scale(float, fixedPoint);
    };

    /**
     * scales such that the height matches the passed value
     * while preserving the current aspect ratio
     */
    scaleToHeight = (height: number, fixedPoint?: IPointName): ImmutableRectangle => {
        const float = height / this.height;
        return this.scale(float, fixedPoint);
    };

    /**
     * scaleToPoint doesn't quite make sense because going to that exact point might break the scale
     * so instead scaleToSide, where the opposite side is fixed.
     *
     * presumably scales from the center of the opposite side, but can pass a fixedPoint if top or bottom is preferred
     * for example, scale x2 to 500 will change the width and height but preserve x1
     */
    scaleToSide = (value: number, side: Side, fixedPoint?: IPointName): ImmutableRectangle => {
        const oppositeSideName = oppositeName(side);
        const oppositeValue = this[oppositeSideName];
        const scale = Math.abs(value - oppositeValue) / Math.abs(this[side] - oppositeValue);
        const fixed = fixedPoint || this.getPoint(sideMidpoint(side));
        return this.scale(scale, fixed);
    }

    /**
     * changing the scale with a fixed ratio is a bit arbitrary because
     * the target point might not be exactly possible while maintaining the aspect ratio
     * could average the x and y changes
     * or could pick either x or y and just use that value
     *
     * midpoints are always fine -- only look at the change in one direction
     * center changes nothing
     * corners are the problem
     */
    scaleToPoint = (point: IRectanglePoint): ImmutableRectangle => {
        if (isCenter(point)) {
            return this;
        }
        if (isMidpoint(point)) {
            if (isCenterX(point)) {
                // top and bottom -> change y
                return this.scaleToSide(point.y, midpointSide(point));
            } else {
                // left and right -> change x
                return this.scaleToSide(point.x, midpointSide(point));
            }
        } else { // isCorner
            /**
             * look at the stretched rectangle to get the scale in both directions
             * and apply the average of the two
             */
            const stretched = this.stretchToPoint(point);
            const scaleX = stretched.width / this.width;
            const scaleY = stretched.height / this.height;
            return this.scale((scaleX + scaleY) / 2, this.getOppositePoint(point));
        }
    }

// ----------------------------STRETCHING--------------------------//
    /**
     * changes the width while keeping the height and y values the same
     * can stretch from the left or right, but default to center
     */
    stretchToWidth = (width: number, fixedProperty: XNames = 'xmid'): ImmutableRectangle => {
        let x = 0;
        switch (fixedProperty) {
            case SIDES.LEFT:
                x = this.x;
                break;
            case SIDES.RIGHT:
                x = this.x2 - width;
                break;
            case CENTERS.X:
                x = this.xmid - .5 * width;
                break;
        }
        return this.altered({
            width,
            x
        });
    };

    /**
     * changes the height while keeping the width and x values the same
     * can stretch from the top or bottom, but default to center
     */
    stretchToHeight = (height: number, fixedProperty: YNames = 'ymid'): ImmutableRectangle => {
        let y = 0;
        switch (fixedProperty) {
            case SIDES.TOP:
                y = this.y;
                break;
            case SIDES.BOTTOM:
                y = this.y2 - height;
                break;
            case CENTERS.Y:
                y = this.ymid - .5 * height;
                break;
        }
        return this.altered({
            height,
            y
        });
    };

    /**
     * alter a rectangle such that it has the desired aspect ratio
     * can use either the width or the height as the basic and just change the other side
     * or can alter both sides but keep the area the same
     * default is area
     */
    stretchToRatio = (ratio: number, preserve?: "width" | "height" | "area", fixedPoint: IPointName = this.center): ImmutableRectangle => {
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
                .shiftToPoint(this.getPoint(fixedPoint))
        }
    }

    /**
     * moves a corner or midpoint of the rectangle to a new position,
     * alters the size and shape of the rectangle
     * make use of the fact that the opposite point stays the same
     * can't just look at the difference because don't know if it's an increase or a decrease
     */
    stretchToPoint = (point: IRectanglePoint): ImmutableRectangle => {
        const opposite = this.getOppositePoint(point);
        return this.stretchToHeight(Math.abs(point.y - opposite.y), opposite.yName)
            .stretchToWidth(Math.abs(point.x - opposite.x), opposite.xName);
    };

// -------------------------ACCESSING NAMED POINTS--------------------------//

    /** creates a shortcut when working with enums
     * @param {string[]} pair
     * @returns {RectanglePoint}
     */
    getPointFromTuple = (pair: PointNameTuple): RectanglePoint => {
        return this.getPointFromNames(pair[0], pair[1]);
    };

    /** create a rectangle point from the x and y names
     * have eliminated the possibility for error by forcing xName and yName to known values only
     * @param {string} xName
     * @param {string} yName
     * @returns {RectanglePoint}
     */
    getPointFromNames = (xName: XNames, yName: YNames): RectanglePoint => {
        return new RectanglePoint({
            x: this[xName],
            y: this[yName],
            xName,
            yName,
        });
    };

    getPoint = (point: IPointName): RectanglePoint => {
        return this.getPointFromNames(point.xName, point.yName);
    }

    /**
     * @param {RectanglePoint} point
     * @returns {RectanglePoint}
     */
    getOppositePoint = (point: IRectanglePoint): RectanglePoint => {
        return this.getPoint(oppositePointName(point));
    };

// -------------------------CONTAINED VALUES--------------------------//

    /**
     * @param {number} value
     * @returns {boolean}
     */
    containsX(value: number): boolean {
        return this.rangeX.contains(value);
    }

    /**
     * @param {number} value
     * @returns {boolean}
     */
    containsY(value: number): boolean {
        return this.rangeY.contains(value);
    }

    /**
     * @param {number} value
     * @returns {number}
     */
    constrainX(value: number): number {
        return this.rangeX.constrain(value);
    }

    /**
     * @param {number} value
     * @returns {number}
     */
    constrainY(value: number): number {
        return this.rangeY.constrain(value);
    }

    /**
     * @param {Object} point
     * @param {number} point.x
     * @param {number} point.y
     * @returns {boolean}
     */
    contains = (point: IPoint): boolean => {
        // returns true if the point is inside the rectangle OR on the border
        return (this.containsX(point.x) && this.containsY(point.y));
    };

    /**
     * returns an edited copy of the point rather than mutating it
     * @param {Object} point
     * @param {number} point.x
     * @param {number} point.y
     * @returns {Object}
     */
    constrain = (point: IPoint): IPoint => {
        return {
            x: this.constrainX(point.x),
            y: this.constrainY(point.y),
        };
    };

}
