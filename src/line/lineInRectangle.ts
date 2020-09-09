import {Rectangle} from "../coreTypes";
import {LineDef} from "./types";
import Segment from "./Segment";
import {toRectangleClass} from "../rectangle";
import Line from "./Line";

/**
 * a line can intersect a rectangle:
 * - not at all
 * - at a single point which is a corner
 * - at two points on opposite or adjacent sides
 * - infinitely if this line is one of the sides of the rectangle
 */

/**
 * want to cutoff an infinite line into a segment that doesn't go outside of the rectangle
 * if it's a single point, can still return as a Segment from the point to itself
 */
export const lineRectangleIntersection = (rect: Rectangle, line: LineDef): Segment | null => {
    const rObj = toRectangleClass(rect);
    // const rSides = rectangleSideSegments(rect);
    const lObj = new Line(line);
    /**
     * see where the line intersects the sides of the rectangle if they were infinite.
     * then check whether that point is on the rectangle or outside it.
     */
    const possibleIntersects = [
        lObj.pointForX(rObj.x1),
        lObj.pointForX(rObj.x2),
        lObj.pointForY(rObj.y1),
        lObj.pointForY(rObj.y2),
    ];
    const endpoints = possibleIntersects.filter(point => rObj.contains(point)); // will there be rounding error problems
                                                                                // here?
    if (endpoints.length === 0) {
        return null;
    } else if (endpoints.length === 1) {
        return new Segment(endpoints[0], endpoints[0]);
    } else {
        return new Segment(endpoints[0], endpoints[1]);
    }
}

export const rectangleSideSegments = (rect: Rectangle): Segment[] => {
    const {x1, x2, y1, y2} = toRectangleClass(rect).coordinates;
    return [
        new Segment([x1, y1], [x2, y1]), // top
        new Segment([x1, y2], [x2, y2]), // bottom
        new Segment([x1, y1], [x1, y2]), // left
        new Segment([x2, y1], [x2, y2]), // right
    ]
}
