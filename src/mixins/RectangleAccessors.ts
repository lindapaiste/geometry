import {HasCoordinates, Range, Rectangle, XY} from "../coreTypes";
import {CenterPoint, CornerPoint, IPointName, MidPoint, toCoordinates, toRectangleProps, XYValues} from "../rectangle";
import {Coordinates} from "../coreTypes";
import RectanglePoint from "../rectangle/points/RectanglePoint";
import {CENTER, CORNERS, MIDPOINTS} from "../rectangle/points";
import {Constructor} from "./types";

/**
 * any class with coordinates should be able to access derived properties
 */
export function WithRectangleAccessors<TBase extends Constructor<Coordinates>>(Base: TBase) {

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

export function WithRectangleFromCoords<TBase extends Constructor<Coordinates>>( Base: TBase ) {

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

export function WithCoordsFromRectangle<TBase extends Constructor<Rectangle>>( Base: TBase ) {

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


/**
 * any class with properties x1, xmid, x2, etc. should be able to access named rectangle points
 */
export function WithRectanglePoints<TBase extends Constructor<XYValues>>(Base: TBase) {

    return class WithRectanglePoints extends Base {

        get center(): RectanglePoint & CenterPoint {
            return this.getPoint(CENTER);
        }

        get corners(): (RectanglePoint & CornerPoint)[] {
            return CORNERS.map(this.getPoint);
        }

        get midpoints(): (RectanglePoint & MidPoint)[] {
            // note: "as" is needed here because using Pick on a union type leads to types outside of the union
            return MIDPOINTS.map(this.getPoint) as (RectanglePoint & MidPoint)[];
        }

        /**
         * want to make sure that the retrieved point inherits the specific point type of the name, eg. MidPoint,
         * CornerPoint, or CenterPoint
         */
        getPoint = <T extends IPointName>(point: T): Pick<T, 'xName' | 'yName'> & RectanglePoint => {
            const {xName, yName} = point;
            return new RectanglePoint({
                xName,
                yName,
                x: this[xName],
                y: this[yName]
            });
        };

    }

}
