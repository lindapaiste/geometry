import {Segment} from "../src";

test("create a Segment classed object", () => {

    const segment = new Segment([1,2], [3,4]);

    expect( segment.start ).toEqual({x: 1, y: 2});
    expect( segment.end ).toEqual({x: 3, y: 4});

    expect( segment.xForY(3)).toEqual(2);
    expect( segment.yForX(2)).toEqual(3);
    expect(segment.contains({x:2,y:3}) ).toBe(true);
    expect(segment.contains({x:2,y:4}) ).toBe(false);

})
