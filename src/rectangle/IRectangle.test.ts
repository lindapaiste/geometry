import {toProps} from "../../../../../image-geometry/src/image-editing/crop/useControlledRectangle.test";
import ImmutableRectangle from "./ImmutableRectangle";
import {CENTERS, SIDES} from "../rectanglePoints/enums";

const initial = new ImmutableRectangle({
    x: 0,
    y: 0,
    width: 500,
    height: 200,
})


test( "can shift in any direction", () => {

    expect( toProps( initial.shiftX( 100 ) ) ).toEqual({
        x: 100,
        y: 0,
        width: 500,
        height: 200,
    })

    expect( toProps( initial.shiftY( 100 ) ) ).toEqual({
        x: 0,
        y: 100,
        width: 500,
        height: 200,
    })

    expect( toProps( initial.shift( 50, 100 ) ) ).toEqual({
        x: 50,
        y: 100,
        width: 500,
        height: 200,
    })

});


test( "can shift a named point to a new value", () => {

    expect( toProps( initial.shiftToPoint( {
        xName: CENTERS.X,
        yName: SIDES.TOP,
        x: 500,
        y: 200
    } ) ) ).toEqual({
        x: 250,
        y: 200,
        width: 500,
        height: 200,
    })

});


test( "can scale from any point", () => {

    //scale from center
    expect( toProps( initial.scale( .5 ) ) ).toEqual({
        x: 125,
        y: 50,
        width: 250,
        height: 100,
    })

    //scale from named point
    expect( toProps( initial.scale( .5, {xName: SIDES.RIGHT, yName: SIDES.BOTTOM} ) ) ).toEqual({
        x: 250,
        y: 100,
        width: 250,
        height: 100,
    })

});
