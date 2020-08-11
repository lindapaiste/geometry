import { IScalable, ObjToLimits } from "./types";
import { INumericRange } from "..";
import NumericRange from "../range/NumericRange";

interface StoredLimit<T> {
  property: keyof T;
  basis?: number;
  range: INumericRange;
}

export default class MultiRangeSizer<T extends Record<any, number>> {
  private readonly initial: IScalable<T> & T;
  /**
   * want to sort by priorities rather than access by name
   */
  private readonly sortedLimits: StoredLimit<T>[];

  private readonly resized: T;

  private readonly failedSome: boolean;

  constructor(object: IScalable<T> & T, limits: ObjToLimits<T>) {
    const mapped = Object.entries(limits)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => ({
        priority: value?.priority || 10,
        range: new NumericRange(value?.min, value?.max),
        property: key as keyof T,
      }));
    this.sortedLimits = mapped.sort((a, b) => a.priority - b.priority);
    this.initial = object;
    this.resized = object;
    this.failedSome = false;

    for (let i = 0; i < this.sortedLimits.length; i++) {
      const range = this.sortedLimits[i].range;
      const value = this.resized[this.sortedLimits[i].property];
      if (!range.contains(value)) {
        const newValue = range.constrain(value);
        const scale = newValue / value;
        /**
         * if the new scale breaks previously set, then don't want to apply
         */
        const passesPrevious = this.sortedLimits
          .slice(0, i)
          .every((prop) => this.isOkScale(scale, prop));
        /**
         * what about subsequent rules?  might be able to use some,
         * but they will all show breaksPrevious because this one fails
         */
        if (passesPrevious) {
          this.resized = object.scale(scale);
        } else {
          this.failedSome = true;
        }
      }
    }
  }

  /**
   * checks that the scale does not push the property outside of its allowed range
   * assumes the scale applies to the resized rather than the original
   */
  private isOkScale = (scale: number, prop: StoredLimit<T>): boolean => {
    const value = this.resized[prop.property];
    return prop.range.contains(value * scale);
  };
}
