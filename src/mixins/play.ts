import {Coordinates} from "../coreTypes";
import {WithRectangleAccessors, WithRectanglePoints} from "./RectangleAccessors";

export class CoordinatesConstructor implements Coordinates {

    public readonly x1: number;
    public readonly x2: number;
    public readonly y1: number;
    public readonly y2: number;

    constructor(coords: Coordinates) {
        this.x1 = coords.x1;
        this.x2 = coords.x2;
        this.y1 = coords.y1;
        this.y2 = coords.y2;
    }
}

export const ComposedRectangle = WithRectanglePoints(WithRectangleAccessors(CoordinatesConstructor));

const myRect = new ComposedRectangle({x1: 0, y1: 0, x2: 5, y2: 5});
