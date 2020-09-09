import {getArea} from "../sized/compute";
import {Resizable} from "./types";

/**
 * can add methods scale, scaleToWidth, scaleToHeight to any class which has properties width and height and a method
 * setSize(Sized) which returns a new object
 */
function ScalableSize<TBase extends Resizable<TBase>>(Base: TBase) {

    return class Scalable extends Base {

        scale = (float: number): TBase => {
            return this.setSize({
                width: this.width * float,
                height: this.height * float,
            });
        }

        scaleToWidth = (width: number): TBase => {
            return this.scale(width / this.width);
        }

        scaleToHeight = (height: number): TBase => {
            return this.scale(height / this.height);
        }
    }

}

/**
 * can add methods stretchToWidth, stretchToHeight, and stretchToRatio to classes with the same interface as for scaling
 */
function StretchableSize<TBase extends Resizable<TBase>>(Base: TBase) {

    return class Stretchable extends Base {

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
