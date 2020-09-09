import {hasNumberProperty, hasMultipleNumberProperties, coordinatesKeys} from "../src";

test( "hasNumberProperty type checker works", () => {
    const hasSample = hasNumberProperty("sample");
    expect( hasSample({sample: 5})).toBe(true);
    expect( hasSample({sample: 5, other: "hello"})).toBe(true);
    expect( hasSample({sample: null})).toBe(false);
    expect( hasSample({sample: "hello"})).toBe(false);
    expect( hasSample({other: 5})).toBe(false);

    expect( hasNumberProperty("myKey")({myKey: 0})).toBe(true);
    expect( hasNumberProperty("myKey")({otherKey: 0})).toBe(false);
});

test( "multiple number property type checker works", () => {

    const coords = {
        x1: 0,
        x2: 1,
        y1: 0,
        y2: 1,
    }
    expect( hasMultipleNumberProperties(coordinatesKeys)(coords)).toBe(true);

    const {x1, ...partial} = coords;
    expect( hasMultipleNumberProperties(coordinatesKeys)(partial)).toBe(false);

    const withExtra = {...coords, other: "something"};
    expect( hasMultipleNumberProperties(coordinatesKeys)(withExtra)).toBe(true);

    const withNonNumber = {...coords, x1: "string"};
    expect( hasMultipleNumberProperties(coordinatesKeys)(withNonNumber)).toBe(false);
});
