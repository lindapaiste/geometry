import {CanSetSize, Constructor} from "./types";
import {Sized} from "../coreTypes";

/**
 * override the setSize method so that it can only set to sizes which fulfill the aspect ratio
 *
 * what about constructing new?
 */

type Obj = CanSetSize<Obj> & { aspectRatio: number }

export function MixinFixedRatio<TBase extends Constructor<Obj>>(Base: TBase) {

    return class FixedRatio extends Base {

        setSize = ({width, height}: Partial<Sized>): Obj => {
            // look at one of height and width, but not both
            if (width !== undefined) {
                return super.setSize({
                    width,
                    height: width / this.aspectRatio,
                })
            } else if (height !== undefined) {
                return super.setSize({
                    height,
                    width: height * this.aspectRatio,
                })
            } else {
                // if both are undefined, change nothing
                return this;
            }
        }
    }

}
