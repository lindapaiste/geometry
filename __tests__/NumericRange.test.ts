import NumericRange from '../src/range/NumericRange';


test("test defined range (0,100)", () => {
    const range = new NumericRange(0, 100);

    expect(range.min).toBe(0);
    expect(range.max).toBe(100);
    expect(range.isFinite()).toBe(true);
    expect(range.length).toBe(100);

    // should contain 50
    expect(range.contains(50)).toBe(true);

    // should contain endpoints
    expect(range.contains(0)).toBe(true);
    expect(range.contains(100)).toBe(true);

    // should not contain -50
    expect(range.contains(-50)).toBe(false);

    // should not contain 150
    expect(range.contains(150)).toBe(false);

    // should constrain 150 to 100
    expect(range.constrain(150)).toBe(100)

    // should constrain -50 to 0
    expect(range.constrain(-50)).toBe(0)

    // should not change value 50 when constraining
    expect(range.constrain(50)).toBe(50)
})

test("test range (_,_) which is open on both ends", () => {

    const range = new NumericRange();

    expect(range.isFinite()).toBe(false);
    expect(range.length).toBe(Infinity);

    // should contain any number
    expect(range.contains(-1000)).toBe(true);
    expect(range.contains(1000)).toBe(true);
    expect(range.contains(0)).toBe(true);

    //should not alter any number when constraining
    expect(range.constrain(50)).toBe(50);
    expect(range.constrain(-50)).toBe(-50);
    expect(range.constrain(0)).toBe(0);
})

test("test range (10,_) which is open on one end", () => {

    const range = new NumericRange(10);

    expect(range.isFinite()).toBe(false);
    expect(range.min).toBe(10);
    expect(range.max).toBe(Infinity);
    expect(range.length).toBe(Infinity);

    expect(range.contains(0)).toBe(false);
    expect(range.constrain(0)).toBe(10);

    expect(range.contains(10)).toBe(true);
    expect(range.constrain(10)).toBe(10);

    expect(range.contains(1000)).toBe(true);
    expect(range.constrain(1000)).toBe(1000);

})

test("test range (_, 10) which is open on one end", () => {

    const range = new NumericRange(undefined,10);

    expect(range.isFinite()).toBe(false);
    expect(range.min).toBe(-Infinity);
    expect(range.max).toBe(10);
    expect(range.length).toBe(Infinity);

    expect(range.contains(0)).toBe(true );
    expect(range.constrain(0)).toBe(0);

    expect(range.contains(10)).toBe(true);
    expect(range.constrain(10)).toBe(10);

    expect(range.contains(1000)).toBe(false);
    expect(range.constrain(1000)).toBe(10);

})

test( "combine overlapping defined ranges (1,3) and (2,4)", () => {
    const a = new NumericRange(1, 3);
    const b = new NumericRange(2, 4);

    expect(a.hasOverlap(b)).toBe(true);

    const union = a.union(b);
    expect(union?.min).toBe(1);
    expect(union?.max).toBe(4);

    const intersection = a.intersection(b);
    expect(intersection?.min).toBe(2);
    expect(intersection?.max).toBe(3);
})

test( "combine non-overlapping defined ranges (1,2) and (3,4)", () => {
    const a = new NumericRange(1, 2);
    const b = new NumericRange(3, 4);

    expect(a.hasOverlap(b)).toBe(false);
    expect(a.union(b)).toBeNull();
    expect(a.intersection(b)).toBeNull();
})

test( "combine overlapping infinite ranges (10,_) and (_,20)", () => {
    const a = new NumericRange(10, undefined);
    const b = new NumericRange(undefined, 20);

    expect(a.hasOverlap(b)).toBe(true);

    // union of (10,_) and (_,20) should be (_,_)
    const union = a.union(b);
    expect(union?.min).toBe(-Infinity);
    expect(union?.max).toBe(Infinity);
    expect(union?.isFinite()).toBe(false);

    // intersection of (10,_) and (_,20) should be (10,20)
    const intersection = a.intersection(b);
    expect(intersection?.min).toBe(10);
    expect(intersection?.max).toBe(20);
    expect(intersection?.isFinite()).toBe(true);
})


test( "combine overlapping infinite ranges (10,_) and (20,_)", () => {
    const a = new NumericRange(10, undefined);
    const b = new NumericRange(20, undefined);

    expect(a.hasOverlap(b)).toBe(true);

    // union should be (10,_)
    const union = a.union(b);
    expect(union?.min).toBe(10);
    expect(union?.max).toBe(Infinity);
    expect(union?.isFinite()).toBe(false);

    // intersection should be (20,_)
    const intersection = a.intersection(b);
    expect(intersection?.min).toBe(20);
    expect(intersection?.max).toBe(Infinity);
    expect(intersection?.isFinite()).toBe(false);
})

test( "combine non-overlapping infinite ranges (10,_) and (_,2)", () => {
    const a = new NumericRange(10, undefined);
    const b = new NumericRange(undefined, 2);

    expect(a.hasOverlap(b)).toBe(false);
    expect(a.union(b)).toBeNull();
    expect(a.intersection(b)).toBeNull();
})
