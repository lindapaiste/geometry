import {Coordinates, Range, Rectangle, XY} from "../coreTypes";
import {toCoordinates, toRectangleProps} from "../rectangle";
import {Constructor} from "./types";

/**
 * any class with coordinates should be able to access derived properties
 */
export function MixinRectangleAccessors<TBase extends Constructor<Coordinates>>(Base: TBase) {

    return class WithRectangleAccessors extends Base {

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

        get xmid(): number {
            return this.x + 0.5 * this.width;
        }

        get ymid(): number {
            return this.y + 0.5 * this.height;
        }

        get aspectRatio(): number {
            return this.width / this.height;
        }

        get range(): Range<XY> {
            return {
                min: {
                    x: this.x1,
                    y: this.y1
                },
                max: {
                    x: this.x2,
                    y: this.y2
                }
            }
        }

        get rangeX(): Range {
            return {
                min: this.x1,
                max: this.x2
            }
        }

        get rangeY(): Range {
            return {
                min: this.y1,
                max: this.y2
            }
        }

        /**
         * use this with spread operator, since get() properties aren't included in spread
         */
        get rectangle(): Rectangle {
            return toRectangleProps(this);
        }

        get coordinates(): Coordinates {
            return toCoordinates(this);
        }

        get area(): number {
            return this.width * this.height;
        }

    }
}


