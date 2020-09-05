import {RangeMethods} from "..";

/**
 * define a scalable object as one with a scale() method
 * which takes a number and returns itself
 */
export interface IScalable {
  scale(scale: number): this;
}

/**
 * a class or object can provide its own scalable properties
 */
export interface IScalableProperties {
  scalableProperties: string[];
}

/**
 * interface defines the scale function, but does not know or care about mutate vs. copy
 */
export interface IScalableObject<
  Scalable extends string,
  OT extends Record<Scalable, number>
> {
  scale(scale: number): OT;

  scalePropertyToValue(propertyName: Scalable, value: number): OT;

  scalePropertyToRange(propertyName: Scalable, range: RangeMethods<number>): OT;

  scaleToFit(propertyMaximums: Limits<Scalable>): OT;

  scaleToCover(propertyMinimums: Limits<Scalable>): OT;
}

/**
 * the limits used for scaling an object are a subset of the scalable properties,
 * where not all properties have to be defined
 */
export type Limits<Scalable extends string> = Partial<
  Record<Scalable, number | undefined>
>;
