import {Sized, XY} from "../coreTypes";
import {IPointName, IRectanglePoint, RectanglePoint} from "../rectangle/points";
import {RectangleValues} from "../rectangle";

// note: mixins must have a constructor with a single param of type any[], cannot specify constructor properties
export type Constructor<T = {}> = new (...args: any[]) => T;


export interface CanSetSize<T> {
    setSize(size: Partial<Sized>): T;
}

export interface CanScale<T> {
    scale(value: number): T;
}

export interface CanShiftByXY<T> {
    shift(value: XY): T;
}

export interface CanShiftToXY<T> {
    shiftTo(value: XY): T;
}

export interface CanGetRProperty {
    getProperty(name: keyof RectangleValues): number;
}

export interface CanGetRPoint {
    getPoint(name: IPointName): RectanglePoint;
}



export type Resizable<T> = Constructor<CanSetSize<T> & Sized>;

export type Shiftable<T> = Constructor<CanShiftByXY<T> & XY>;

