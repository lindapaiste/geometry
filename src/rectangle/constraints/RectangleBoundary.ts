import {RangeMethods} from "../../range";
import ImmutableRectangle from "../ImmutableRectangle";
import {fits} from "../../sized/compare";
import {isXName, midpointToSide, oppositePointName} from "../points";
import {Point, Sized} from "../../coreTypes";

/**
 * an XY Range which can contain or constrain Rectangle objects rather than Points
 *
 * contains is simple true or false and properties of the rectangle don't matter
 *
 * in order to force containment of a rectangle, need to know the methods available for containment, eg. shift, scale,
 * stretch for scale and stretch, may also want to know the fixed point basis
 *
 * copy-and-pasting from BoundedRectangle for now
 * not sure how these will relate in the future
 */
export default class RectangleBoundary implements RangeMethods<ImmutableRectangle> {
    public readonly boundary: RangeMethods<Point> & Sized;

    constructor(boundary: RangeMethods<Point> & Sized) {
        this.boundary = boundary;
    }

    contains(value: ImmutableRectangle): boolean {
        return value.corners.every(this.boundary.contains);
    }

    constrain(
        value: ImmutableRectangle,
        mode: "stretch" | "scale" | "shift" = "shift"
    ): ImmutableRectangle {
        switch (mode) {
            case "scale":
                return this.scaleBack(value);
            case "shift":
                return this.scaleBack(this.shiftBack(value));
            case "stretch":
                return this.stretchBack(value);
        }
    }

    /**
     * does this rectangle need to be stretched or scaled back to fit, or is just shifting enough?
     */
    isTooLarge(value: Sized): boolean {
        return fits(this.boundary)(value);
    }

    /**
     * for moves which do not impact the size,
     * can execute the move and then push back to inside the boundary
     * this is better than checking edges because sometimes we are moving a midpoint
     * doing the move gets the new edges
     */
    shiftBack = (rect: ImmutableRectangle): ImmutableRectangle => {
        return rect.corners.reduce((r, point) => {
            if (this.boundary.contains(point)) {
                return r; // no change
            } else {
                // spread gets the names from the initial and the x and y from the constrained
                return r.shiftToPoint({...point, ...this.boundary.constrain(point)});
            }
        }, rect);
    };

    /**
     * when scaling need to make sure that it doesn't get so big that it overflows
     * there are two ways to address this:
     *
     * 1) limit the scale such that the rectangle fits WITHOUT moving
     * 2) allow anything up to the maximum scale and move the rectangle to fit
     *
     * currently using #1, but am open to changing
     *
     * scaleToPoint doesn't quite make sense because going to that exact point might break the scale
     * so scaleToSide instead
     */
    scaleBack = (rect: ImmutableRectangle): ImmutableRectangle => {
        return rect.midpoints.reduce((r, point) => {
            if (this.boundary.contains(point)) {
                return r; // no change
            } else {
                /**
                 * if a midpoint wound up outside, pull back in the side that the midpoint is on
                 */
                const constrained = this.boundary.constrain(point);
                const side = midpointToSide(point);
                const value = isXName(side) ? constrained.x : constrained.y;
                return r.scaleToSide(value, side, oppositePointName(point));
            }
        }, rect);
    };

    /**
     * for a stretch, need to constrain all four corners
     * again, do the stretch first and then check points because the stretch could be
     * based on a midpoint where the midpoint itself is contained, but stretching to that
     * midpoint causes a corner to overflow
     */
    stretchBack = (rect: ImmutableRectangle): ImmutableRectangle => {
        return rect.corners.reduce((r, point) => {
            if (this.boundary.contains(point)) {
                return r; // no change
            } else {
                // spread gets the names from the initial and the x and y from the constrained
                return r.stretchToPoint({
                    ...point,
                    ...this.boundary.constrain(point),
                });
            }
        }, rect);
    };
}
