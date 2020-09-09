import {WithRectangleAccessors} from "./RectangleAccessors";
import {WithRectanglePoints} from "./RectanglePoints";
import {CoordinatesConstructor} from "./CoordsConstructor";

export const ComposedRectangle = WithRectanglePoints(WithRectangleAccessors(CoordinatesConstructor));

const myRect = new ComposedRectangle({x1: 0, y1: 0, x2: 5, y2: 5});
