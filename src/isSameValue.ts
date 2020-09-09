// ----------------------ERROR MARGIN HELPERS-------------------------- //

/**
 * see if two numbers are equal or if the difference between the two is less than the allowed margin of error
 */
export const isSameNumber = (a: number, b: number, margin: number = 0): boolean => {
    return Math.abs(b - a) <= margin;
}

/**
 * allows for either a or b to be undefined, but will return false is either or both are not defined numbers
 */
export const isSameValue = (a?: number, b?: number, margin: number = 0): boolean => {
    return a !== undefined && b !== undefined && isSameNumber(a, b, margin);
}
