import {Constructor} from "./types";
import {Coordinates, Rectangle} from "../coreTypes";

export function WithCoordsFromRectangle<TBase extends Constructor<Rectangle>>(Base: TBase) {

    return class WithCoords extends Base implements Coordinates {

        get x1(): number {
            return this.x;
        }

        get y1(): number {
            return this.y;
        }

        get x2(): number {
            return this.x + this.width;
        }

        get y2(): number {
            return this.y + this.height;
        }

    }
}
