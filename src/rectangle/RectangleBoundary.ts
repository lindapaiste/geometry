import {IPoint} from "../rectanglePoints/types";
import {IRangeMethods} from "../range/types";
import ImmutableRectangle from "./ImmutableRectangle";
import {isXName} from "../rectanglePoints/booleans";
import {midpointSide} from "../rectanglePoints/midpointsSides";

/**
 * an XY Range which can contain or constrain Rectangle objects rather than Points
 *
 * copy-and-pasting from BoundedRectangle for now
 * not sure how these will relate in the future
 */
export default class RectangleBoundary implements IRangeMethods<ImmutableRectangle> {

    public readonly boundary: IRangeMethods<IPoint>;

    constructor(boundary: IRangeMethods<IPoint>) {
        this.boundary = boundary;
    }

    contains(value: ImmutableRectangle): boolean {
        return value.corners.every(this.boundary.contains);
    }

    constrain(value: ImmutableRectangle, mode: "stretch" | "scale" | "shift" = "shift"): ImmutableRectangle {
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
     * for moves which do not impact the size,
     * can execute the move and then push back to inside the boundary
     * this is better than checking edges because sometimes we are moving a midpoint
     * doing the move gets the new edges
     */
    shiftBack = (rect: ImmutableRectangle): ImmutableRectangle => {
        return rect.corners.reduce(
            (r, point) => {
                if (this.boundary.contains(point)) {
                    return r; // no change
                } else {
                    // spread gets the names from the initial and the x and y from the constrained
                    return r.shiftToPoint({...point, ...this.boundary.constrain(point)})
                }
            }, rect)
    }

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
        return rect.midpoints.reduce(
            (r, point) => {
                if (this.boundary.contains(point)) {
                    return r; // no change
                } else {
                    /**
                     * if a midpoint wound up outside, pull back in the side that the midpoint is on
                     */
                    const constrained = this.boundary.constrain(point);
                    const side = midpointSide(point);
                    const value = isXName(side) ? constrained.x : constrained.y;
                    return r.scaleToSide(value, side);
                }
            }, rect)
    }

    /**
     * for a stretch, need to constrain all four corners
     * again, do the stretch first and then check points because the stretch could be
     * based on a midpoint where the midpoint itself is contained, but stretching to that
     * midpoint causes a corner to overflow
     */
    stretchBack = (rect: ImmutableRectangle): ImmutableRectangle => {
        return rect.corners.reduce(
            (r, point) => {
                if (this.boundary.contains(point)) {
                    return r; // no change
                } else {
                    // spread gets the names from the initial and the x and y from the constrained
                    return r.stretchToPoint({...point, ...this.boundary.constrain(point)})
                }
            }, rect)
    }
}
