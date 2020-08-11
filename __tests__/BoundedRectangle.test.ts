import ImmutableRectangle from "../src/rectangle/ImmutableRectangle";
import {BoundedRectangle} from "../src/rectangle/BoundedRectangle";
import {SIDES} from "../src/rectanglePoints/enums";
import {toRectangleProps} from "../src/rectangle/util";

const original = new ImmutableRectangle({
    x: 100,
    y: 100,
    width: 200,
    height: 200,
});

const boundary = new ImmutableRectangle({
    x: 0,
    y: 0,
    width: 400,
    height: 400,
})

const bounded = new BoundedRectangle(original, boundary);

test("is contained when shifting outside of boundaries", () => {

    const movedRight = bounded.shiftToPoint({
        xName: SIDES.RIGHT,
        yName: SIDES.TOP,
        x: 500,
        y: 100,
    });

    //should move as much as it can along x
    expect(toRectangleProps(movedRight)).toEqual({
        x: 200,
        y: 100,
        width: 200,
        height: 200,
    })

    const movedBoth = bounded.shiftToPoint({
        xName: SIDES.RIGHT,
        yName: SIDES.TOP,
        x: 150,
        y: -50,
    });

    //should move as much as it can along x
    expect(toRectangleProps(movedBoth)).toEqual({
        x: 0,
        y: 0,
        width: 200,
        height: 200,
    })
})
