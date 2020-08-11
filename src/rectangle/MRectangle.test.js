import MutableRectangle from './MutableRectangle';

const pure = (Rectangle) => {
    const {x1,y1,x2,y2} = Rectangle;
    return {x1, y1, x2, y2};
};


test('create a 500x750 rectangle', () => {
    const rect = new MutableRectangle(500, 750, 0, 0);
    expect( pure( rect) )
        .toEqual({x1: 0, x2: 500, y1: 0, y2: 750});
});

test('use shiftX function', () => {
    const rect = new MutableRectangle(500, 750, 0, 0);
    const moved = rect.shiftX( -200 );
    expect ( pure(moved) )
        .toEqual( pure(new MutableRectangle(500, 750, -200, 0) ));
});

test('set Rectangle x', () => {
    const rect = new MutableRectangle(500, 750, 0, 0);
    rect.x = 1000;
    expect( pure(rect) )
        .toEqual( pure(new MutableRectangle(500, 750, 1000, 0)));
});

test('set Rectangle xmid', () => {
    const rect = new MutableRectangle(500, 750, 0, 0);
    rect.xmid = 1000;
    expect( pure(rect) )
        .toEqual( pure( new MutableRectangle(500, 750, 750, 0)));
});

test('set Rectangle width', () => {
    const rect = new MutableRectangle(500, 750, 0, 0);
    rect.width = 1000;
    expect( pure(rect) )
        .toEqual( pure( new MutableRectangle(1000, 750, -250, 0)));
});
