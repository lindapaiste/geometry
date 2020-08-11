export { IRectangle, ICoordinates } from "./rectangle/types";
export { ISized, PropWidth, PropHeight } from "./sized/types";
export { IPointName, IPoint, IRectanglePoint } from "./rectanglePoints/types";
export {
  INumericRange,
  IDefinedXYRange,
  IXYRange,
  IRange,
} from "./range/types";

export {
  getScaleToCover,
  getScaleToFit,
  getScaleForHeight,
  getScaleForWidth,
} from "./scaling/ScaledObject";

export { default as NumericRange } from "./range/NumericRange";
export { default as XYRange } from "./range/XYRange";
export { default as Rectangle } from "./rectangle/ImmutableRectangle";
export { default as RectangleBoundary } from "./rectangle/RectangleBoundary";
export { default as BoundedRectangle } from "./rectangle/BoundedRectangle";
export { default as SizeFinder } from "./sized/SizeFinder";
export { default as ScaledVersionCreator } from "./scaling/ScaledVersion";
