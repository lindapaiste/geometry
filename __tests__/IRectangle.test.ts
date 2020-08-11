import ImmutableRectangle from "../src/rectangle/ImmutableRectangle";
import {CENTERS, SIDES} from "../src/rectanglePoints/enums";
import {toRectangleProps} from "../src/rectangle/util";

const initial = new ImmutableRectangle({
    x: 0,
    y: 0,
    width: 500,
    height: 200,
})


test("can shift in any direction", () => {

    expect(toRectangleProps(initial.shiftX(100))).toEqual({
        x: 100,
        y: 0,
        width: 500,
        height: 200,
    })

    expect(toRectangleProps(initial.shiftY(100))).toEqual({
        x: 0,
        y: 100,
        width: 500,
        height: 200,
    })

    expect(toRectangleProps(initial.shift(50, 100))).toEqual({
        x: 50,
        y: 100,
        width: 500,
        height: 200,
    })

});


test("can shift a named point to a new value", () => {

    expect(toRectangleProps(initial.shiftToPoint({
        xName: CENTERS.X,
        yName: SIDES.TOP,
        x: 500,
        y: 200
    }))).toEqual({
        x: 250,
        y: 200,
        width: 500,
        height: 200,
    })

});


test("can scale from any point", () => {

    //scale from center
    expect(toRectangleProps(initial.scale(.5))).toEqual({
        x: 125,
        y: 50,
        width: 250,
        height: 100,
    })

    //scale from named point
    expect(toRectangleProps(initial.scale(.5, {xName: SIDES.RIGHT, yName: SIDES.BOTTOM}))).toEqual({
        x: 250,
        y: 100,
        width: 250,
        height: 100,
    })

});
