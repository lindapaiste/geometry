// ------------------SWITCH BETWEEN DEGREES AND RADIANS------------------ //

/**
 * note: these conversions do not restrict to 0 to 360 or 0 to 2PI, it will keep negative values as negatives and
 * values larger than a circle as larger values
 */

export const degreesToRadians = (degrees: number): number => {
    return degrees * Math.PI / 180;
}

export const radiansToDegrees = (radians: number): number => {
    return radians * 180 / Math.PI;
}

// --------------------------SLOPE FROM ANGLE----------------------------- //

/**
 * expect the angle to be relative to the x-axis (pointing right)
 *
 * slope is the tangent of the angle in radians
 * ranges from 0 to infinity
 * will be equal to infinity for any vertical line aka angle 90, 270, etc.
 * note: never actually returns Infinity, is just an arbitrary very high number
 */

export const degreesToSlope = (angle: number): number => {
    return radiansToSlope(degreesToRadians(angle));
}

export const radiansToSlope = (angle: number): number => {
    return Math.tan(angle);
}



// --------------------------ANGLE FROM SLOPE----------------------------- //

/**
 * will always return a value in the range of -90 to 90 degrees, relative to the x-axis
 */

export const slopeToDegrees = (slope: number): number => {
    return radiansToDegrees(slopeToRadians(slope));
}

export const slopeToRadians = (slope: number): number => {
    return Math.atan(slope);
}






