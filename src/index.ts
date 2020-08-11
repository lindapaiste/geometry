export {I_Rectangle, I_Coordinates} from "./rectangle/types";
export {I_Sized, PropWidth, PropHeight} from "./sized/types";
export {I_PointName, I_Point, I_RectanglePoint} from "./rectanglePoints/types";
export {I_NumericRange, I_DefinedXYRange, I_XYRange, I_Range} from "./range/types";

export {getScaleToCover, getScaleToFit, getScaleForHeight, getScaleForWidth} from "./scaling/ScaledObject";

export {default as NumericRange} from "./range/NumericRange";
export {default as XYRange} from "./range/XYRange";
export {default as Rectangle} from "./rectangle/ImmutableRectangle";
export {default as RectangleBoundary} from "./rectangle/RectangleBoundary";
export {default as BoundedRectangle} from "./rectangle/BoundedRectangle";
export {default as SizeFinder} from "./sized/SizeFinder";
export {default as ScaledVersionCreator} from "./scaling/ScaledVersion";
