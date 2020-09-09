import {EitherPoint, Point, PointTuple} from "../coreTypes";

/**
 * typecheck can be lenient when there are only two possible types
 */
const isTuple = (point: EitherPoint): point is PointTuple => {
    return Array.isArray(point);
}

export const pointToXY = (point: EitherPoint): Point => {
    if (isTuple(point)) {
        const [x, y] = point;
        return {x, y};
    } else return point;
}

export const pointToTuple = (point: EitherPoint): PointTuple => {
    if (!isTuple(point)) {
        return [point.x, point.y];
    } else return point;
}
