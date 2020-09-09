import {CENTER, CORNERS, MIDPOINTS} from "../src/rectangle/points/constants";
import {isCenter, isCorner, isMidpoint} from "../src/rectangle/points/booleans";
import {oppositePointName} from "../src/rectangle/points/opposites";
import {midpointToSide, sideToMidpoint} from "../src/rectangle/points/convert";

test("rectangle corners, midpoints, and center can be properly identified", () => {

    expect(isMidpoint(CENTER)).toBe(false);
    expect(isCorner(CENTER)).toBe(false);
    expect(isCenter(CENTER)).toBe(true);

    CORNERS.forEach((point) => {
        expect(isMidpoint(point)).toBe(false);
        expect(isCorner(point)).toBe(true);
        expect(isCenter(point)).toBe(false);
    })

    MIDPOINTS.forEach((point) => {
        expect(isMidpoint(point)).toBe(true);
        expect(isCorner(point)).toBe(false);
        expect(isCenter(point)).toBe(false);
    })

});

test( "get rectangle point opposites", () => {

    // center is its own opposite
    expect( oppositePointName(CENTER)).toEqual(CENTER);

    // opposite corner
    expect( oppositePointName({xName: "x1", yName: "y1"})).toEqual({xName: "x2", yName: "y2"});

    // opposite midpoint
    expect( oppositePointName({xName: "x1", yName: "ymid"})).toEqual({xName: "x2", yName: "ymid"});
});

test( "can switch between rectangle side names and midpoints", () => {

    // side to midpoint
    expect( sideToMidpoint("x1")).toEqual({xName: "x1", yName: "ymid"});
    expect( sideToMidpoint("x2")).toEqual({xName: "x2", yName: "ymid"});
    expect( sideToMidpoint("y1")).toEqual({xName: "xmid", yName: "y1"});
    expect( sideToMidpoint("y2")).toEqual({xName: "xmid", yName: "y2"});

    // midpoint to side
    expect( midpointToSide({xName: "x1", yName: "ymid"})).toEqual("x1");
    expect( midpointToSide({xName: "x2", yName: "ymid"})).toEqual("x2");
    expect( midpointToSide({xName: "xmid", yName: "y1"})).toEqual("y1");
    expect( midpointToSide({xName: "xmid", yName: "y2"})).toEqual("y2");
});
