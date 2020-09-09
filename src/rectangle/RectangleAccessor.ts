import RectanglePoint from "./points/RectanglePoint";
import {RectangleValues} from "./types";
import {CENTER, CenterPoint, CornerPoint, CORNERS, IPointName, MidPoint, MIDPOINTS} from "./points";
import {toCoordinates, toRectangleProps} from "./convert";
import {Coordinates, HasCoordinates, Range, Rectangle, Sized, XY} from "../coreTypes";
import {HasRangesXY} from "../range";

/**
 * copy & pasted version which ONLY accesses props, and has no methods -- except for a point accessor
 */
export default class RectangleAccessor implements XY, Sized, Coordinates, HasCoordinates, Rectangle, RectangleValues, HasRangesXY {
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

// ----------------------------CREATION--------------------------//

    constructor(props: Partial<Rectangle>) {
        this.x1 = props.x || 0;
        this.y1 = props.y || 0;
        this.x2 = this.x1 + (props.width || 0);
        this.y2 = this.y1 + (props.height || 0);
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
        return this.x + 0.5 * this.width;
    }

    get ymid(): number {
        return this.y + 0.5 * this.height;
    }

    get aspectRatio(): number {
        return this.width / this.height;
    }

    get range(): Range<XY> {
        return {
            min: {
                x: this.x1,
                y: this.y1
            },
            max: {
                x: this.x2,
                y: this.y2
            }
        }
    }

    get rangeX(): Range {
        return {
            min: this.x1,
            max: this.x2
        }
    }

    get rangeY(): Range {
        return {
            min: this.y1,
            max: this.y2
        }
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

}
