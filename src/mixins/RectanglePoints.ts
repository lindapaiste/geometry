import {Constructor} from "./types";
import {CenterPoint, CornerPoint, IPointName, MidPoint, XYValues} from "../rectangle";
import RectanglePoint from "../rectangle/points/RectanglePoint";
import {CENTER, CORNERS, MIDPOINTS} from "../rectangle/points";

/**
 * any class with properties x1, xmid, x2, etc. should be able to access named rectangle points
 */
export function MixinRectanglePoints<TBase extends Constructor<XYValues>>(Base: TBase) {

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
