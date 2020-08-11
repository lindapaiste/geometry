import { IPoint } from "..";

/**
 * a range object has a min and a max
 * they are both defined here, but can use Partial<I_Range> for open-ended
 */
export interface IRange {
  min: number;
  max: number;
}

/**
 * define an interface which has the methods of the class
 * make this generic so that both RectangularRange and NumericRange can implement it
 */
export interface IRangeMethods<T> {
  contains(value: T): boolean;

  constrain(value: T): T;
}

/**
 * includes methods which are in the NumericRange class but not XYRange
 */
export interface INumericRange extends IRangeMethods<number>, Partial<IRange> {
  hasMin(): this is this & { min: number };

  hasMax(): this is this & { max: number };

  isDefined(): this is this & IRange;

  isTooLarge(value: number): boolean;

  isTooSmall(value: number): boolean;

  hasOverlap(range: INumericRange): boolean;

  intersection(range: INumericRange): INumericRange | null;

  union(range: INumericRange): INumericRange | null;
}

/**
 * a pair of ranges which are both defined
 */
export interface IDefinedXYRange {
  rangeX: IRange;
  rangeY: IRange;
}

/**
 * a pair of ranges which can be open in any direction
 */
export interface IXYRange {
  rangeX: Partial<IRange>;
  rangeY: Partial<IRange>;
}

/**
 * a rectangular range can contain and constrain a point.
 * it can also contain and constrain just an x or a y value
 */
export interface IXYRangeMethods extends IRangeMethods<IPoint> {
  containsX(value: number): boolean;

  containsY(value: number): boolean;

  constrainX(value: number): number;

  constrainY(value: number): number;
}
