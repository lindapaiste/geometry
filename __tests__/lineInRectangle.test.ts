import {lineRectangleIntersection} from "../src/line/lineInRectangle";
import {Segment} from "../src";

const rect = {
    x: 0,
    y: 0,
    width: 4,
    height: 5,
};

test("line never intersects rectangle", () => {

    const line = {
        slope: -1,
        yIntercept: -1,
    }

    expect( lineRectangleIntersection(rect, line)).toBe(null);

})

test("line intersects rectangle as a segment", () => {

    const seg1 = lineRectangleIntersection(rect, {
        slope: 1,
        yIntercept: 0,
    }) as Segment;
    expect( seg1 ).toBeTruthy();

    // how to I know which end is which?
    expect( Math.min( seg1.x1, seg1.x2 ) ).toEqual( 0 );
    expect( Math.max( seg1.x1, seg1.x2 ) ).toEqual( 4 );
    expect( Math.min( seg1.y1, seg1.y2 ) ).toEqual( 0 );
    expect( Math.max( seg1.y1, seg1.y2 ) ).toEqual( 4 );
})
