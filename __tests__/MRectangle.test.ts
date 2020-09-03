import MutableRectangle from '../src/rectangle/MutableRectangle';
import {toRectangleProps} from "../src/rectangle";


test('create a 500x750 rectangle', () => {
    const rect = new MutableRectangle(500, 750, 0, 0);
    expect( toRectangleProps( rect) )
        .toEqual({width: 500, height: 750, x: 0, y: 0});
});

test('set Rectangle x', () => {
    const rect = new MutableRectangle(500, 750, 0, 0);
    rect.x = 1000;
    expect( toRectangleProps(rect) )
        .toEqual( toRectangleProps(new MutableRectangle(500, 750, 1000, 0)));
});

test('set Rectangle xmid', () => {
    const rect = new MutableRectangle(500, 750, 0, 0);
    rect.xmid = 1000;
    expect( toRectangleProps(rect) )
        .toEqual( toRectangleProps( new MutableRectangle(500, 750, 750, 0)));
});

test('set Rectangle width', () => {
    const rect = new MutableRectangle(500, 750, 0, 0);
    rect.width = 1000;
    expect( toRectangleProps(rect) )
        .toEqual( toRectangleProps( new MutableRectangle(1000, 750, -250, 0)));
});
