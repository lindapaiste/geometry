import NumericRange from './NumericRange';


test('range (0, 100) should contain 50', () => {
    const range = new NumericRange(0, 100);
    expect(range.contains(50))
        .toBe(true)
});

test('range (0, 100) should not contain -50', () => {
    const range = new NumericRange(0, 100);
    expect(range.contains(-50))
        .toBe(false)
});

test('range (0, 100) should not contain 150', () => {
    const range = new NumericRange(0, 100);
    expect(range.contains(150))
        .toBe(false)
});

test('range (0, 100) should constrain 150 to 100', () => {
    const range = new NumericRange(0, 100);
    expect(range.constrain(150))
        .toBe(100)
});

test('range (0, 100) should constrain -50 to 0', () => {
    const range = new NumericRange(0, 100);
    expect(range.constrain(-50))
        .toBe(0)
});

test('intersection of (10,_) and (_,2) should be null', () => {
    const first = new NumericRange(10, undefined);
    const second = new NumericRange(undefined, 2);
    expect( first.intersection(second))
        .toBe(null)
});

test('union of (10,_) and (_,2) should be null', () => {
    const first = new NumericRange(10, undefined);
    const second = new NumericRange(undefined, 2);
    expect( first.union(second))
        .toBe(null)
});

test('intersection of (10,_) and (_,20) should be (10,20)', () => {
    const first = new NumericRange(10, undefined);
    const second = new NumericRange(undefined, 20);
    expect( first.intersection(second) )
        .toEqual({min: 10, max: 20})
});

test('union of (10,_) and (_,20) should be (_,_)', () => {
    const first = new NumericRange(10, undefined);
    const second = new NumericRange(undefined, 20);
    expect( first.union(second) )
        .toEqual({min: undefined, max: undefined})
});

test('intersection of (1,3) and (2,4) should be (2,3)', () => {
    const first = new NumericRange(1,3);
    const second = new NumericRange(2,4);
    expect( first.intersection(second) )
        .toEqual({min: 2, max: 3})
});

test('union of (1,3) and (2,4) should be (1,4)', () => {
    const first = new NumericRange(1,3);
    const second = new NumericRange(2,4);
    expect( first.union(second) )
        .toEqual({min: 1, max: 4})
});