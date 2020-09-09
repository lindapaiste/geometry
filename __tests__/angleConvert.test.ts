import {degreesToRadians, radiansToDegrees, degreesToSlope, slopeToDegrees} from "../src/angles";

test( "can convert between slopes and angles", () => {

    // all increments of 180 should have the same slope
    expect(degreesToSlope(-135)).toBeCloseTo(1);
    expect(degreesToSlope(45)).toBeCloseTo(1);
    expect(degreesToSlope(225)).toBeCloseTo(1);
    expect(degreesToSlope(405)).toBeCloseTo(1);

    // but will convert back to a value in range -90 to +90 only
    expect(slopeToDegrees(1)).toBeCloseTo(45);

    expect(degreesToSlope(-45)).toBeCloseTo(-1);
    expect(degreesToSlope(135)).toBeCloseTo(-1);
    expect(slopeToDegrees(-1)).toBeCloseTo(-45);

    expect(degreesToSlope(0)).toBeCloseTo(0);
    expect(slopeToDegrees(0)).toBeCloseTo(0);

    expect(degreesToSlope(90)).toBeGreaterThan(10**7); //is just a very large number rather than Infinity
    expect(slopeToDegrees(Infinity)).toBeCloseTo(90); //but could also be -90

})

/**
 * helper to avoid repetition
 * pass in a pair of values from a known conversion and test the converter outputs
 */
const degRadTest = (degrees: number, radians: number) => test(
    `check equality between ${degrees} degrees and ${radians} radians`,
    () => {

        expect(radiansToDegrees(radians)).toBeCloseTo(degrees);
        expect(degreesToRadians(degrees)).toBeCloseTo(radians);
    }
);

degRadTest(30, Math.PI / 6 );

degRadTest(225, 1.25 * Math.PI );

degRadTest(-90, -.5 * Math.PI );

degRadTest(540, 3 * Math.PI );
