import ImmutableRectangle from "../src/rectangle/ImmutableRectangle";
import {toRPointProps} from "../src/rectangle/points/convert";
import {IRectanglePoint} from "../src/rectangle/points";
import {isSameSize} from "../src/sized/compare";
import {CENTER, XNAMES, YNAMES} from "../src/rectangle/points/constants";

const initial = new ImmutableRectangle({
    x: 0,
    y: 0,
    width: 500,
    height: 200,
})

const isPreservedPoint = (point: IRectanglePoint) => {
    const original = initial.getPoint(point);
    expect(point.x).toEqual(original.x);
    expect(point.y).toEqual(original.y);
}


test("shifting rectangle should preserve size", () => {

    //shift x
    let shifted = initial.shiftX(100);
    expect(isSameSize(shifted, initial)).toBe(true);
    expect(shifted.y).toEqual(initial.y);
    expect(shifted.x).toEqual(initial.x + 100);

    //shift y
    shifted = initial.shiftY(100);
    expect(isSameSize(shifted, initial)).toBe(true);
    expect(shifted.y).toEqual(initial.y + 100);
    expect(shifted.x).toEqual(initial.x);

    // shift such that a x name value equals a specific amount
    XNAMES.forEach(name => {
        shifted = initial.shiftToX(100, name);
        // size should be unchanged
        expect(isSameSize(shifted, initial)).toBe(true);
        // y should be unchanged
        expect(shifted.y).toEqual(initial.y);
        // the x name value should be what it was set to
        expect(shifted[name]).toEqual(100);
    });

    // same for y
    YNAMES.forEach(name => {
        shifted = initial.shiftToY(100, name);
        expect(isSameSize(shifted, initial)).toBe(true);
        expect(shifted.x).toEqual(initial.x);
        expect(shifted[name]).toEqual(100);
    });

    expect(initial.shift({x: 50, y: 100}).props).toEqual({
        x: 50,
        y: 100,
        width: 500,
        height: 200,
    })

});


test("can shift a rectangle's named point to a new value while maintaining size", () => {

    expect(initial.shiftToPoint({
        xName: 'xmid',
        yName: 'y1',
        x: 500,
        y: 200
    }).props).toEqual({
        x: 250,
        y: 200,
        width: 500,
        height: 200,
    })

});


test("can apply a scale value to a rectangle from any point", () => {

    // scale from center
    expect(initial.scale(.5).props).toEqual({
        x: 125,
        y: 50,
        width: 250,
        height: 100,
    })

    // scale from named point
    expect(initial.scale(.5, {xName: 'x2', yName: 'y2'}).props).toEqual({
        x: 250,
        y: 100,
        width: 250,
        height: 100,
    })

});

test("stretching a rectangle should change the size", () => {

    // right side midpoint -- ymid change is ignored
    expect(initial.stretchToPoint({xName: "x2", yName: "ymid", x: 300, y: 300}).props).toEqual({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
    })

    // origin corner -- changes both x1 and x2
    expect(initial.stretchToPoint({xName: "x1", yName: "y1", x: 300, y: 100}).props).toEqual({
        x: 300,
        y: 100,
        width: 200,
        height: 100,
    })

})

test("can retrieve any named point from a rectangle", () => {

    // right side midpoint
    const point: IRectanglePoint = {
        x: 500,
        y: 100,
        xName: "x2",
        yName: "ymid"
    };

    // check that all accessors return the same point
    expect(toRPointProps(initial.getPoint({xName: "x2", yName: "ymid"}))).toEqual(point);
    expect(toRPointProps(initial.getPointFromNames("x2", "ymid"))).toEqual(point);
    expect(toRPointProps(initial.getPointFromTuple(["x2", "ymid"]))).toEqual(point);

    // check the primary accessor with another point -- origin corner
    expect(toRPointProps(initial.getPoint({xName: "x1", yName: "y1"}))).toEqual({
        x: 0,
        y: 0,
        xName: "x1",
        yName: "y1"
    })

})

test("can stretch a rectangle to a width or height from different points", () => {

    expect(initial.stretchToHeight(500, "y1").coordinates).toEqual({
        x1: 0,
        x2: 500,
        y1: 0,
        y2: 500,
    })

    expect(initial.stretchToHeight(500, "y2").coordinates).toEqual({
        x1: 0,
        x2: 500,
        y1: -300,
        y2: 200,
    })

    expect(initial.stretchToHeight(500, "ymid").coordinates).toEqual({
        x1: 0,
        x2: 500,
        y1: -150,
        y2: 350,
    })

    expect(initial.stretchToWidth(100, "x1").coordinates).toEqual({
        x1: 0,
        x2: 100,
        y1: 0,
        y2: 200,
    })

    expect(initial.stretchToWidth(100, "x2").coordinates).toEqual({
        x1: 400,
        x2: 500,
        y1: 0,
        y2: 200,
    })

    expect(initial.stretchToWidth(100, "xmid").coordinates).toEqual({
        x1: 200,
        x2: 300,
        y1: 0,
        y2: 200,
    })

})


test("can force a rectangle to a specific aspect ratio", () => {
    expect(initial.stretchToRatio(2, "height", CENTER).props).toEqual({
        x: 50,
        y: 0,
        width: 400,
        height: 200,
    })
    expect(initial.stretchToRatio(2, "height", {xName: "x1", yName: "y1"}).props).toEqual({
        x: 0,
        y: 0,
        width: 400,
        height: 200,
    })
    expect(initial.stretchToRatio(2, "width", CENTER).props).toEqual({
        x: 0,
        y: -25,
        width: 500,
        height: 250,
    })
    expect(initial.stretchToRatio(2, "width", {xName: "x1", yName: "y1"}).props).toEqual({
        x: 0,
        y: 0,
        width: 500,
        height: 250,
    })

    // use a different example for preserve area which has cleaner numbers, 12 x 3 -> 6 x 6, centered at (0,0)
    const long = new ImmutableRectangle({
        width: 12,
        height: 3,
        x: -6,
        y: -1.5
    })
    const square = new ImmutableRectangle({
        width: 6,
        height: 6,
        x: -3,
        y: -3
    })
    expect(long.stretchToRatio(1, "area", CENTER).props).toEqual(square.props);
    expect(square.stretchToRatio(4, "area", CENTER).props).toEqual(long.props);
});

test("can set a rectangle's x1, x2, y1, or y2 while preserving the aspect ratio", () => {

    // set y2 to 100 from each x -> changes height to 100 and width to 250
    expect(initial.scaleToSide(100, "y2", {xName: "x1", yName: "y1"}).props).toEqual({
        x: 0,
        y: 0,
        width: 250,
        height: 100,
    })
    expect(initial.scaleToSide(100, "y2", {xName: "xmid", yName: "y1"}).props).toEqual({
        x: 125,
        y: 0,
        width: 250,
        height: 100,
    })
    expect(initial.scaleToSide(100, "y2", {xName: "x2", yName: "y1"}).props).toEqual({
        x: 250,
        y: 0,
        width: 250,
        height: 100,
    })

    // also try from center, setting y2 to 300 -> changes height to 300 and width to 750
    expect(initial.scaleToSide(300, "y2", CENTER).props).toEqual({
        x: -125,
        y: -50,
        width: 750,
        height: 300,
    })

    // set x1 to 100 from each y -> changes width to 400 and height to 160
    expect(initial.scaleToSide(100, "x1", {xName: "x2", yName: "y1"}).props).toEqual({
        x: 100,
        y: 0,
        width: 400,
        height: 160,
    })
    expect(initial.scaleToSide(100, "x1", {xName: "x2", yName: "ymid"}).props).toEqual({
        x: 100,
        y: 20,
        width: 400,
        height: 160,
    })
    expect(initial.scaleToSide(100, "x1", {xName: "x2", yName: "y2"}).props).toEqual({
        x: 100,
        y: 40,
        width: 400,
        height: 160,
    })
})

test("can scale towards a specific point", () => {

    // if the point can be achieved exactly, expect to land on it

    // exact x2/y2
    let scaled = initial.scaleToPoint({
        xName: "x2",
        yName: "y2",
        x: 1000,
        y: 400,
    });
    expect( scaled.x1).toBeCloseTo(0);
    expect( scaled.y1).toBeCloseTo(0);
    expect( scaled.x2).toBeCloseTo(1000);
    expect( scaled.y2).toBeCloseTo(400);

    // exact x1/y1
    scaled = initial.scaleToPoint({
        xName: "x1",
        yName: "y1",
        x: 250,
        y: 100,
    });
    expect( scaled.x1).toBeCloseTo(250);
    expect( scaled.y1).toBeCloseTo(100);
    expect( scaled.x2).toBeCloseTo(500);
    expect( scaled.y2).toBeCloseTo(200);

    // when scaling towards a midpoint, only the side matters
    scaled = initial.scaleToPoint({
        xName: "xmid",
        yName: "y2",
        x: 10000,
        y: 100,
    });
    expect( scaled.x1).toBeCloseTo(125);
    expect( scaled.y1).toBeCloseTo(0);
    expect( scaled.x2).toBeCloseTo(375);
    expect( scaled.y2).toBeCloseTo(100);
})
