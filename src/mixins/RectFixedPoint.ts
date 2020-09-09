import {IPointName} from "../rectangle/points";
import {Sized} from "../coreTypes";
import {translation} from "../points";
import {CanGetRPoint, CanSetSize, CanShiftByXY, Constructor} from "./types";

/**
 * setSize method doesn't need to take the fixed point because it is set in the constructor
 */

type Obj = CanGetRPoint & CanShiftByXY<Obj> & CanSetSize<Obj>

export function MixinFixedPoint<TBase extends Constructor<Obj>>(Base: TBase, point: IPointName) {

    return class FixedPoint extends Base {

        readonly fixedPoint = this.getPoint(point);

        /**
         * override the setSize method such that it calls the parent's setSize method, but shifts back to the correct
         * point before returning
         */
        setSize = (size: Partial<Sized>) => {
            const resized = super.setSize(size);
            const movedPoint = resized.getPoint(this.fixedPoint);
            const shiftAmount = translation(this.fixedPoint, movedPoint);
            return resized.shift(shiftAmount);
        }

    }

}
