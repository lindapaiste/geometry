import NumericRange from "./NumericRange";
import {CombinableRange, HasRangesXY, RangeMethods} from "./types";
import {Coordinates, HasCoordinates, Range, Sized, XY} from "../coreTypes";
import {rangeXYtoCoords, isInvertedCoords} from "./convert";

/**
 * XY range is allowed to be open in any direction
 * all Rectangles are XYRanges, but not all XYRanges are Rectangles
 * it is only a rectangle if it is closed on all four sides
 */
export default class XYRange implements HasCoordinates, HasRangesXY, RangeMethods<XY>, Sized, CombinableRange<XY>, Range<XY> {
    /**
     * not sure if there is much purpose in storing the x1s,
     * but it allows for an object to be constructed from another object
     */
    public readonly rangeX: NumericRange;
    public readonly rangeY: NumericRange;

    /**
     * can construct from a Rectangle class or an object of props
     */
    constructor(coordinates: Partial<Coordinates>) {
        const {x1, x2, y1, y2} = coordinates;

        this.rangeX = new NumericRange(x1, x2);
        this.rangeY = new NumericRange(y1, y2);
    }

    containsX(value: number): boolean {
        return this.rangeX.contains(value);
    }

    containsY(value: number): boolean {
        return this.rangeY.contains(value);
    }

    constrainX(value: number): number {
        return this.rangeX.constrain(value);
    }

    constrainY(value: number): number {
        return this.rangeY.constrain(value);
    }

    contains(point: XY): boolean {
        return this.containsX(point.x) && this.containsY(point.y);
    };

    /**
     * returns an edited copy of the point rather than mutating it
     * passes through any properties in addition to X and Y
     */
    constrain<T extends XY>(point: T): T {
        return {
            ...point,
            x: this.constrainX(point.x),
            y: this.constrainY(point.y),
        };
    };

    /**
     * check whether all four sides have values
     */
    isFinite = (): boolean => {
        return this.rangeX.isFinite() && this.rangeY.isFinite();
    };

    get width(): number {
        return this.rangeX.length;
    }

    get height(): number {
        return this.rangeY.length;
    }

    get coordinates(): Coordinates {
        return {
            x1: this.rangeX.min,
            x2: this.rangeX.max,
            y1: this.rangeY.min,
            y2: this.rangeY.max,
        }
    }

    get min(): XY {
        return {
            x: this.rangeX.min,
            y: this.rangeY.min
        }
    }

    get max(): XY {
        return {
            x: this.rangeX.max,
            y: this.rangeY.max
        }
    }

    hasOverlap(range: Range<XY>): boolean {
        const obj = toXYRange(range);
        return this.rangeX.hasOverlap(obj.rangeX) && this.rangeY.hasOverlap(obj.rangeY);
    }

    union(range: Range<XY>): XYRange | null {
        // should the union exist when there is no overlap? aka disjoint union
        // illustrated https://media.cheggcdn.com/media%2F0c1%2F0c15e9b5-ca8d-48f5-af67-cdd4fddc2dae%2FphpxrSUt7.png

        return new XYRange({
            x1: Math.min(this.min.x, range.min.x),
            x2: Math.max(this.max.x, range.max.x),
            y1: Math.min(this.min.y, range.min.y),
            y2: Math.max(this.max.y, range.max.y),
        })
    }

    intersection(range: Range<XY>): XYRange | null {
        const coords = {
            x1: Math.max(this.min.x, range.min.x),
            x2: Math.min(this.max.x, range.max.x),
            y1: Math.max(this.min.y, range.min.y),
            y2: Math.min(this.max.y, range.max.y),
        };

        return isInvertedCoords(coords) ? null : new XYRange(coords);
    }
}

/**
 * helper for combine methods, enforces that the object implementing Range<XY> is an XYRange
 *
 * interface Range<XY> has a min and max which are each XY or undefined
 * want to convert to separate rangeX and rangeY
 */
export const toXYRange = (range: Range<XY>): XYRange => {
    if (range instanceof XYRange) {
        return range;
    } else {
        return new XYRange(rangeXYtoCoords(range));
    }
}
