import {NumericRange} from "./NumericRange";
import {ICoordinates} from "../rectangle/types";
import {IDefinedXYRange, INumericRange, IXYRange, IXYRangeMethods,} from "./types";
import {IPoint} from "../points/types";

/**
 * XY range is allowed to be open in any direction
 * all Rectangles are XYRanges, but not all XYRanges are Rectangles
 * it is only a rectangle if it is closed on all four sides
 */
export default class XYRange
    implements Partial<ICoordinates>, IXYRange, IXYRangeMethods {
    /**
     * not sure if there is much purpose in storing the x1s,
     * but it allows for an object to be constructed from another object
     */
    public readonly x1: number | undefined;
    public readonly x2: number | undefined;
    public readonly y1: number | undefined;
    public readonly y2: number | undefined;
    public readonly rangeX: INumericRange;
    public readonly rangeY: INumericRange;

    /**
     * can construct from a Rectangle class or an object of props
     */
    constructor(coordinates: Partial<ICoordinates>) {
        this.x1 = coordinates.x1;
        this.x2 = coordinates.x2;
        this.y1 = coordinates.y1;
        this.y2 = coordinates.y2;

        this.rangeX = new NumericRange(this.x1, this.x2);
        this.rangeY = new NumericRange(this.y1, this.y2);
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

    contains = (point: IPoint): boolean => {
        // returns true if the point is inside the rectangle OR on the border
        return this.containsX(point.x) && this.containsY(point.y);
    };

    /**
     * returns an edited copy of the point rather than mutating it
     */
    constrain = (point: IPoint): IPoint => {
        return {
            x: this.constrainX(point.x),
            y: this.constrainY(point.y),
        };
    };

    /**
     * check whether all four sides have values
     */
    isDefined = (): this is this & Required<ICoordinates> & IDefinedXYRange => {
        return this.rangeX.isDefined() && this.rangeY.isDefined();
    };
}
