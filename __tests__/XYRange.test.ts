import {XYRange} from "../src/range";

const a = new XYRange({
    x1: 0,
    x2: 5,
    y1: 0,
    y2: 5
});


const b = new XYRange({
    x1: 2,
    x2: 10,
    y1: 2,
    y2: 10
});

// outside both on x and y
const outsideBoth = {
    x: -1,
    y: -1
}

// inside a but not b
const insideA = {
    x: 1,
    y: 1
}

// inside b but not a
const insideB = {
    x: 7,
    y: 7
}

// inside both a and b
const insideBoth = {
    x: 3,
    y: 3
}

// inside neither a nor b, but inside the union
const insideUnion = {
    x: 1,
    y: 7
}

test("XYRange contains", () => {
    expect(a.contains(outsideBoth)).toBe(false);
    expect(a.contains(insideA)).toBe(true);
    expect(a.contains(insideB)).toBe(false);
    expect(a.contains(insideBoth)).toBe(true);
    expect(a.contains(insideUnion)).toBe(false);

    expect(b.contains(outsideBoth)).toBe(false);
    expect(b.contains(insideA)).toBe(false);
    expect(b.contains(insideB)).toBe(true);
    expect(b.contains(insideBoth)).toBe(true);
    expect(b.contains(insideUnion)).toBe(false);
})

test("XYRange constrain", () => {
    expect(a.constrain(outsideBoth)).toEqual({x: 0, y: 0});
    expect(a.constrain(insideA)).toEqual(insideA);
    expect(a.constrain(insideB)).toEqual({x: 5, y: 5});
    expect(a.constrain(insideBoth)).toEqual(insideBoth);
    expect(a.constrain(insideUnion)).toEqual({x: 1, y: 5});
})

test("XYRange individual X and Y methods", () => {
    expect(a.containsX(-1)).toEqual(false);
    expect(a.constrainX(-1)).toEqual(0);
    expect(a.containsX(1)).toEqual(true);
    expect(a.constrainX(1)).toEqual(1);
    expect(a.containsX(10)).toEqual(false);
    expect(a.constrainX(10)).toEqual(5);

    expect(b.containsY(-1)).toEqual(false);
    expect(b.constrainY(-1)).toEqual(2);
    expect(b.containsY(5)).toEqual(true);
    expect(b.constrainY(5)).toEqual(5);
    expect(b.containsY(20)).toEqual(false);
    expect(b.constrainY(20)).toEqual(10);
})

test("XYRange intersections and unions", () => {

    expect(a.hasOverlap(b)).toBe(true);
    expect(b.hasOverlap(a)).toBe(true);

    // check union A & B
    const uAB = a.union(b);
    expect(uAB?.min).toEqual({x: 0, y: 0});
    expect(uAB?.max).toEqual({x: 10, y: 10});
    expect(uAB?.coordinates).toEqual({x1: 0, x2: 10, y1: 0, y2: 10});
    expect(uAB?.contains(outsideBoth)).toBe(false);
    expect(uAB?.contains(insideA)).toBe(true);
    expect(uAB?.contains(insideB)).toBe(true);
    expect(uAB?.contains(insideBoth)).toBe(true);
    expect(uAB?.contains(insideUnion)).toBe(true);

    // check intersection A & B
    const iAB = a.intersection(b);
    expect(iAB?.min).toEqual({x: 2, y: 2});
    expect(iAB?.max).toEqual({x: 5, y: 5});
    expect(iAB?.coordinates).toEqual({x1: 2, x2: 5, y1: 2, y2: 5});
    expect(iAB?.contains(outsideBoth)).toBe(false);
    expect(iAB?.contains(insideA)).toBe(false);
    expect(iAB?.contains(insideB)).toBe(false);
    expect(iAB?.contains(insideBoth)).toBe(true);
    expect(iAB?.contains(insideUnion)).toBe(false);

    // check combinations between A and an infinite range C which is open on two sides, x2 and y1
    const c = new XYRange({
        x1: 2,
        x2: undefined,
        y1: undefined,
        y2: 20
    });

    expect(a.hasOverlap(c)).toBe(true);
    expect(c.hasOverlap(a)).toBe(true);

    // check union A & C
    const uAC = a.union(c);
    expect(uAC?.min).toEqual({x: 0, y: -Infinity});
    expect(uAC?.max).toEqual({x: Infinity, y: 20});
    expect(uAC?.coordinates).toEqual({x1: 0, x2: Infinity, y1: -Infinity, y2: 20});

    // check intersection A & C
    const iAC = a.intersection(c);
    expect(iAC?.min).toEqual({x: 2, y: 0});
    expect(iAC?.max).toEqual({x: 5, y: 5});
    expect(iAC?.coordinates).toEqual({x1: 2, x2: 5, y1: 0, y2: 5});
})
