import {NumericRange} from "../range/NumericRange";
import {StringIndexed} from "../../function-factory";
import {I_NumericRange} from "../range/types";

/**
 * define a scalable object as one with a scale() method
 * which takes a number and returns itself
 */
export interface I_Scalable {
    scale(scale: number): this;
}


//type def is not ideal but is workable
export type Limits<Scalable extends string, OT extends Record<Scalable, number> = Record<Scalable, number>> =
    Partial<Pick<OT, Scalable>>
    & StringIndexed;

/**
 * interface defines the scale function, but does not know or care about mutate vs. copy
 */
export interface I_ScalableObject<Scalable extends string, OT extends Record<Scalable, number>> {
    scale(scale: number): OT,

    scalePropertyToValue(propertyName: Scalable, value: number): OT,

    scalePropertyToRange(propertyName: Scalable, range: I_NumericRange): OT,

    scaleToFit(propertyMaximums: Limits<Scalable, OT>): OT,

    scaleToCover(propertyMinimums: Limits<Scalable, OT>): OT
}
