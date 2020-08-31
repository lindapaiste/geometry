import {lineToFormula} from "../src/line/convert";

test("convert multiple formats of line into formulas", () => {

    const f1 = lineToFormula({
        angle: 135,
        point: [1,0]
    });
    expect(f1.yIntercept).toBeCloseTo( 1 );
    expect(f1.slope).toBeCloseTo( -1 );


    const f2 = lineToFormula([[1,2], [3,4]]);
    expect(f2.yIntercept).toBeCloseTo(1);
    expect(f2.slope).toBeCloseTo(1);

})
