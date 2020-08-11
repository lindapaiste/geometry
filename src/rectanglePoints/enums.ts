/**
 * phasing out enums in favor of typed strings
 */

/**
 * Enum for rectangle side names
 * @readonly
 * @enum {string}
 */

export enum SIDES {
    LEFT = 'x1',
    RIGHT = 'x2',
    TOP = 'y1',
    BOTTOM = 'y2',
}

/**
 * Enum for rectangle center names
 * @readonly
 * @enum {string}
 */
export enum CENTERS {
    X = 'xmid',
    Y = 'ymid',
}

// export type XSides = SIDES.LEFT | SIDES.RIGHT;
// export type YSides = SIDES.TOP | SIDES.BOTTOM;

export type XSides = 'x1' | 'x2';
export type YSides = 'y1' | 'y2';
export type Side = XSides | YSides;

// export type XNames = XSides | CENTERS.X;
// export type YNames = YSides | CENTERS.Y;

export type XCenter = 'xmid';
export type YCenter = 'ymid';
export type XNames = XSides | XCenter;
export type YNames = YSides | YCenter;


export interface CornerPoint {
    xName: XSides;
    yName: YSides;
}

export interface CenterPoint {
    xName: XCenter; // typeof CENTERS.X;
    yName: YCenter; // typeof CENTERS.Y;
}

export type MidPoint = {
    xName: XSides;
    yName: YCenter; // CENTERS.Y;
} | {
    xName: XCenter; // CENTERS.X;
    yName: YSides;
}

