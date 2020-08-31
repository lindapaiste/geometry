import {IPoint, shiftBy, shiftX, shiftY} from "../src";

test("move points", () => {
    const point: IPoint = {x: 5, y: 10};

    expect( shiftX(point, 20)).toEqual({x: 25, y: 10});
    expect( shiftY(point, 20)).toEqual({x: 5, y: 30});
    expect( shiftBy(point, {x: -20, y: -20})).toEqual({x: -15, y: -10});
    expect( shiftBy(point, point)).toEqual({x: 10, y: 20});
})
