import {Constructor} from "./types";
import {Coordinates, Rectangle} from "../coreTypes";

export function WithRectangleFromCoords<TBase extends Constructor<Coordinates>>(Base: TBase) {

    return class WithRectangle extends Base implements Rectangle {

        get x(): number {
            return this.x1;
        }

        get y(): number {
            return this.y1;
        }

        get width(): number {
            return this.x2 - this.x1;
        }

        get height(): number {
            return this.y2 - this.y1;
        }
    }
}
