import {Coordinates, HasCoordinates, Range, Rectangle, Sized, XY} from "../coreTypes";
import {HasRangesXY} from "../range";

// --------------------------------PROPS VS CLASS-------------------------------- //

/**
 * extract just the I_Rectangle props so that it doesn't matter if it's an entire class implementing I_Rectangle (which
 * might not be spreadable). this is needed for comparing equality in jest tests
 *
 * type definition means that it will return a complete IRectangle is the input was complete, but Partial if the input
 * was Partial
 */
export const toRectangleProps = <R extends Partial<Rectangle>>(obj: R): Pick<R, keyof Rectangle> => ({
    x: obj.x,
    y: obj.y,
    width: obj.width,
    height: obj.height,
});

export const toCoordinates = (obj: Coordinates): Coordinates => ({
    x1: obj.x1,
    x2: obj.x2,
    y1: obj.y1,
    y2: obj.y2
})

// -----------------------------RECT VS. COORDS VS. RANGE------------------------------ //

/**
 * a rectangle or a range can be defined by:
 * - coordinates: x1, x2, y1, y2
 * - rectangle props: x, y, width, height
 * - two opposite points (min and max)
 * - rangeX and rangeY
 *
 * these are all interchangeable
 *
 * it becomes difficult to detect which type an input is when it can be partial
 */

/**
 * Keep in mind that the props may fulfill multiple of the possible definitions, so must remove potential conflicts in
 * order to just look at property keys.  Otherwise, for example, an object which fits AnyDef by having an appropriate
 * rangeX and rangeY but has a property called "coordinates" that doesn't fulfill ICoordinates would cause trouble, as
 * it would falsely return true for HasCoordinates typecheck. Type NoConflicts means that if the props have a
 * "coordinates" property, it must be of the right type, and so on.
 */
type OneDef = HasRangesXY | Range<XY> | Partial<Coordinates> | Partial<Rectangle> | HasCoordinates;

type NoConflict = Partial<HasRangesXY & Range<XY> & Coordinates & Rectangle & HasCoordinates>;

type AnyDef = OneDef & NoConflict;

const isPairedRanges = (def: AnyDef): def is HasRangesXY => {
    return "rangeX" in def && "rangeY" in def;
}

const isRangeXY = (def: AnyDef): def is Range<XY> => {
    return "min" in def && "max" in def;
}

const isHasCoordinates = (def: AnyDef): def is HasCoordinates => {
    return "coordinates" in def;
}

/**
 * props may fulfill multiple of the possible definitions, so look at the more well-defined first, using
 * Partial<IRectangle> as a last resort, since this could lose information by applying defaults.
 */
/* TODO: finish
const anyToRectangle = (props: AnyDef): ImmutableRectangle => {
    if (props instanceof ImmutableRectangle) {
        return props;
    } else if (props instanceof XYRange) {
        return ImmutableRectangle.fromCoordinates(props.coordinates);
    } else if (isCompleteRectangle(props)) {
        return new ImmutableRectangle(props);
    } else if (isCompleteCoordinates(props)) {
        return ImmutableRectangle.fromCoordinates(props);
    } else if (isHasCoordinates(props)) {
        return ImmutableRectangle.fromCoordinates(props.coordinates);
    }
    {

    }

}*/

export const rangeXYtoCoords = (range: Range<XY>): Coordinates => {
    const {min, max} = range;
    // could double check min/max
    return {
        x1: min.x,
        x2: max.x,
        y1: min.y,
        y2: max.y
    }
}

// --------------------------------HELPERS-------------------------------- //

/**
 * access properties individually instead of using object spread in case param implements properties through magic get()
 */

// could allow for custom defaults
export const makeCompleteRectangle = (rect: Partial<Rectangle>): Rectangle => ({
    x: rect.x || 0,
    y: rect.y || 0,
    width: rect.width || 0,
    height: rect.height || 0,
});

export const coordsToRect = (coords: Coordinates): Rectangle => ({
    x: coords.x1,
    y: coords.y1,
    width: coords.x2 - coords.x1,
    height: coords.y2 - coords.y1,
});

export const rectToCoords = (rect: Rectangle): Coordinates => ({
    x1: rect.x,
    y1: rect.y,
    x2: rect.x + rect.width,
    y2: rect.y + rect.height,
});


// --------------------------------INVERTED-------------------------------- //

/**
 * does a rectangle or a set of coordinates have a negative width or height
 */
export const isInvertedRect = ({width, height}: Sized) => {
    return width < 0 || height < 0;
}
