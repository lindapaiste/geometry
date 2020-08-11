import ImmutableRectangle from "./ImmutableRectangle";
import { XNames, YNames } from "../rectanglePoints/enums";
import { IXYRangeMethods } from "../range/types";
import { IPointName, IRectanglePoint } from "..";
import { isXName } from "../rectanglePoints/booleans";
import { midpointSide } from "../rectanglePoints/midpointsSides";

/**
 * uses the internal rectangle's functions to execute the move,
 * but first restricts based on boundary
 *
 * this is designed for contained mode rather than cover mode,
 * but can calculate cover by switching rectangle and boundary
 */

export default class BoundedRectangle {
  private readonly rectangle: ImmutableRectangle;
  private readonly boundary: IXYRangeMethods;

  constructor(rectangle: ImmutableRectangle, boundary: IXYRangeMethods) {
    this.rectangle = rectangle;
    this.boundary = boundary;
  }

  /**
   * instead of typing out every comparison, ie. x1 vs x1
   * can get all corners of the rectangle and make sure that they are contained in the boundary
   */
  isOverflow = (rect: ImmutableRectangle): boolean => {
    return !rect.corners.every((point) => this.boundary.contains(point));
  };

  // ----------------------------MOVING--------------------------//

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
        return r.shiftToPoint({ ...point, ...this.boundary.constrain(point) });
      }
    }, rect);
  };

  shiftX = (change: number): ImmutableRectangle => {
    return this.shiftBack(this.rectangle.shiftX(change));
  };

  shiftY = (change: number): ImmutableRectangle => {
    return this.shiftBack(this.rectangle.shiftY(change));
  };

  shift = (changeX?: number, changeY?: number): ImmutableRectangle => {
    return this.shiftBack(this.rectangle.shift(changeX, changeY));
  };

  shiftToPoint = (point: IRectanglePoint): ImmutableRectangle => {
    return this.shiftBack(this.rectangle.shiftToPoint(point));
  };

  // ----------------------------SCALING--------------------------//

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
        const side = midpointSide(point);
        const value = isXName(side) ? constrained.x : constrained.y;
        return r.scaleToSide(value, side);
      }
    }, rect);
  };

  scale = (float: number, fixedPoint?: IRectanglePoint): ImmutableRectangle => {
    return this.scaleBack(this.rectangle.scale(float, fixedPoint));
  };

  scaleToPoint = (point: IRectanglePoint): ImmutableRectangle => {
    return this.scaleBack(this.rectangle.scaleToPoint(point));
  };

  // ----------------------------STRETCHING--------------------------//

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

  stretchToWidth = (
    width: number,
    fixedProperty?: XNames
  ): ImmutableRectangle => {
    return this.stretchBack(
      this.rectangle.stretchToWidth(width, fixedProperty)
    );
  };

  stretchToHeight = (
    height: number,
    fixedProperty?: YNames
  ): ImmutableRectangle => {
    return this.stretchBack(
      this.rectangle.stretchToHeight(height, fixedProperty)
    );
  };

  stretchToPoint = (point: IRectanglePoint): ImmutableRectangle => {
    return this.stretchBack(this.rectangle.stretchToPoint(point));
  };

  /**
   * using scaleBack rather than stretchBack because want to keep the applied ratio
   */
  stretchToRatio = (
    ratio: number,
    preserve?: "width" | "height" | "area",
    fixedPoint?: IPointName
  ): ImmutableRectangle => {
    return this.scaleBack(
      this.rectangle.stretchToRatio(ratio, preserve, fixedPoint)
    );
  };
}
