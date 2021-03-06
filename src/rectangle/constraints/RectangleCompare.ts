import {RectangleValues, toRectangleClass} from "../index";
import ImmutableRectangle from "../ImmutableRectangle";
import {PROPERTIES} from "./compare";
import {isSameAspectRatio} from "../../sized/compare";
import {ALL_POINTS} from "../points";
import {Rectangle} from "../../coreTypes";
import {isSameNumber} from "../../isSameValue";

/**
 * the reason this is a class is to reduce recalculation of the same values, since multiple booleans depend on the same
 * value checks
 */

export default class RectangleCompare {
    public readonly a: ImmutableRectangle;
    public readonly b: ImmutableRectangle;

    public readonly sharedKeys: (keyof RectangleValues)[]

    constructor(a: Rectangle, b: Rectangle, margin: number) {
        this.a = toRectangleClass(a);
        this.b = toRectangleClass(b);

        this.sharedKeys = PROPERTIES.filter(name => {
            isSameNumber(this.a[name], this.b[name], margin)
        })
    }

    private _shares = (keys: (keyof RectangleValues)[]): boolean => {
        return keys.every(this.sharedKeys.includes);
    }

    isSameAspectRatio = (): boolean => {
        // margin??
        return isSameAspectRatio(this.a, this.b);
    }

    isSameXY = (): boolean => {
        return this._shares(["x1", "y1"]);
    }

    isSameSize = (): boolean => {
        return this._shares(["width", "height"]);
    }

    isSameRectangle = (): boolean => this.isSameXY() && this.isSameSize();

    isShifted = (): boolean => this.isSameSize() && !this.isSameXY();

    isScaled = (): boolean => this.isSameAspectRatio() && !this.isSameSize();

    isStretched = (): boolean => !this.isSameAspectRatio() && !this.isSameSize();

    sharedPointNames = () => {
        return ALL_POINTS.filter(
            point => this._shares([point.xName, point.yName])
        )
    }

    changedKeys = () => {
        return PROPERTIES.filter(key => !this._shares([key]))
    }

    sharedProperties = () => {
        return this.sharedKeys.reduce((obj, key) => ({...obj, [key]: this.a[key]}), {} as Partial<RectangleValues>)
    }

}
