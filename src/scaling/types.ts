import {I_NumericRange} from "../range/types";

/**
 * define a scalable object as one with a scale() method
 * which takes a number and returns itself
 */
export interface I_Scalable {
    scale(scale: number): this;
}

/**
 * a class or object can provide its own scalable properties
 */
export interface I_ScalableProperties {
    scalableProperties: string[];
}

/**
 * interface defines the scale function, but does not know or care about mutate vs. copy
 */
export interface I_ScalableObject<Scalable extends string, OT extends Record<Scalable, number>> {
    scale(scale: number): OT,

    scalePropertyToValue(propertyName: Scalable, value: number): OT,

    scalePropertyToRange(propertyName: Scalable, range: I_NumericRange): OT,

    scaleToFit(propertyMaximums: Limits<Scalable>): OT,

    scaleToCover(propertyMinimums: Limits<Scalable>): OT
}

/**
 * the limits used for scaling an object are a subset of the scalable properties
 */
export type Limits<Scalable extends string> = Partial<Record<Scalable, number>>;
