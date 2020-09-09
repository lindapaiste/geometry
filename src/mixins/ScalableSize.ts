import {Resizable} from "./types";

/**
 * can add methods scale, scaleToWidth, scaleToHeight to any class which has properties width and height and a method
 * setSize(Sized) which returns a new object
 */
function MixinScalableSize<TBase extends Resizable<TBase>>(Base: TBase) {

    return class ScalableSize extends Base {

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

