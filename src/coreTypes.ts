/**
 * can minimize the potential for circular dependencies by defining shared types outside of any folder
 */

//-----------------------------------TYPE CHECK FACTORIES----------------------------------//

export const hasNumberProperty = <K extends string>(key: K) => <T>(obj: T & Partial<Record<K, any>>): obj is T & Record<K, number> => {
    return typeof obj[key] === "number";
}

export const hasMultipleNumberProperties = <K extends string>(keys: K[]) => <T>(obj: T & Partial<Record<K, any>>): obj is T & Record<K, number> => {
    return keys.every(key => typeof obj[key] === "number");
}

//-----------------------------------POINT / POSITION----------------------------------//

export interface Point {
    x: number;
    y: number;
}

export interface XY extends Point {
}

export interface IPoint extends Point {} //back compat

export const isXY = (point: any): point is XY => {
    return typeof point === "object" &&
        "x" in point && "y" in point &&
        typeof point.x === "number" && typeof point.y === "number";
}

export type PointTuple = [number, number];

export type EitherPoint = Point | PointTuple;

//--------------------------------------RANGE-------------------------------------//

/**
 * a range is an object with a min and a max
 * by default min and max are numbers, but can use generic to specify other types such as XY points
 */
export interface Range<T = number> {
    min: T;
    max: T;
}

export interface MinMax<T = number> extends Range<T> {

}

export interface CanContain<T = number> {
    contains(value: T): boolean;
}

export interface CanConstrain<T = number> {
    constrain(value: T): T;
}

//--------------------------------------SIZED-------------------------------------//

/**
 * An object is sized if it has a width and a height.
 * All rectangles are sized, but not all sized objects are rectangles because they do not need an x or y. (sized +
 * position = rectangle)
 */
export interface Sized {
    width: number;
    height: number;
}
export interface ISized extends Sized {} // back compat

export const extractSize = <T extends Partial<Sized>>(obj: T): Pick<T, keyof Sized> => ({
    width: obj.width,
    height: obj.height,
});

//------------------------------------RECTANGLE-----------------------------------//

export interface Rectangle extends Sized, Point {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IRectangle extends Rectangle{} // back compat

export interface HasRectangle {
    rectangle: Rectangle;
}

export const rectangleKeys: (keyof Rectangle)[] = ["x", "y", "width", "height"];

export const isCompleteRectangle = hasMultipleNumberProperties(rectangleKeys);

//------------------------------------COORDINATES-----------------------------------//

export interface Coordinates {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

export interface ICoordinates extends Coordinates{} // back compat

export interface HasCoordinates {
    coordinates: Coordinates;
}

export const coordinatesKeys: (keyof Coordinates)[] = ["x1", "x2", "y1", "y2"];

export const isCompleteCoordinates = hasMultipleNumberProperties(coordinatesKeys);

//-----------------------------------STANDARD PROPS----------------------------------//

export interface PropLength {
    length: number;
}

export interface PropWidth {
    width: number;
}

export interface PropHeight {
    height: number;
}

export const hasLength = hasNumberProperty("length");

export const hasWidth = hasNumberProperty("width");

export const hasHeight = hasNumberProperty("height");
