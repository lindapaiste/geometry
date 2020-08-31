import {IPoint, PointTuple, pointToTuple, pointToXY} from "../src";

test("convert points between tuples and xy objects", () => {

    const tuple: PointTuple = [5,3];
    const xy: IPoint = {x: 5, y: 3};

    expect( pointToTuple(tuple)).toEqual(tuple);
    expect( pointToTuple(xy)).toEqual(tuple);
    expect( pointToXY(xy)).toEqual(xy);
    expect( pointToXY(tuple)).toEqual(xy);
})
