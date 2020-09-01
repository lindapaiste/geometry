import {IPoint, IRectangle, setX, setY, shiftPointBy, shiftPointX, shiftPointY} from "../src";

test("move points", () => {
    const point: IPoint = {x: 5, y: 10};

    expect( shiftPointX(point, 20)).toEqual({x: 25, y: 10});
    expect( shiftPointY(point, 20)).toEqual({x: 5, y: 30});
    expect( shiftPointBy(point, {x: -20, y: -20})).toEqual({x: -15, y: -10});
    expect( shiftPointBy(point, point)).toEqual({x: 10, y: 20});
})

test("set x y values", () => {
    const point: IPoint = {x: 5, y: 10};
    const rect: IRectangle = {x: 5, y: 10, width: 10, height: 20};

    expect( setX(point, 25)).toEqual({x: 25, y: 10});
    expect( setY(point, 25)).toEqual({x: 5, y: 25});
    expect( setX(rect, 25)).toEqual({x: 25, y: 10, width: 10, height: 20});
    expect( setY(rect, 25)).toEqual({x: 5, y: 25, width: 10, height: 20});
})
