/**
 * an object is sized if it has a width and a height.
 * rectangles are sized, but they are also positioned
 * whereas I_Sized objects do not need an x or y
 */
export interface ISized {
    width: number,
    height: number,
}

export interface PropWidth {
    width: number,
}

export interface PropHeight {
    height: number,
}
