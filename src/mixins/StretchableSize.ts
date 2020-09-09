import {Resizable} from "./types";
import {getArea} from "../sized/compute";

/**
 * can add methods stretchToWidth, stretchToHeight, and stretchToRatio to classes with the same interface as for scaling
 */
function MixinStretchableSize<TBase extends Resizable<TBase>>(Base: TBase) {

    return class StretchableSize extends Base {

        stretchToWidth = (width: number): TBase => {
            return this.setSize({width});
        }

        stretchToHeight = (height: number): TBase => {
            return this.setSize({height});
        }

        stretchToRatio = (ratio: number, preserve: "width" | "height" | "area" = "area"): TBase => {
            if (preserve === "width") {
                return this.setSize({height: this.width / ratio});
            } else if (preserve === "height") {
                return this.setSize({width: this.height * ratio});
            } else {
                const area = getArea(this);
                return this.setSize({
                    width: Math.sqrt(ratio * area),
                    height: Math.sqrt(area / ratio),
                })
            }
        }
    }
}
