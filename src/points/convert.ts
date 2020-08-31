import {EitherPoint, IPoint, PointTuple} from "./types";

export const isTuple = (point: EitherPoint): point is PointTuple => {
    return Array.isArray(point);
}

export const isXY = (point: EitherPoint): point is IPoint => {
    return "x" in point && "y" in point;
}


export const pointToXY = (point: EitherPoint): IPoint => {
    if ( isXY(point)) {
        return point;
    } else {
        const [x,y] = point;
        return {x,y};
    }
}

export const pointToTuple = (point: EitherPoint): PointTuple => {
    if ( isXY(point) ) {
        return [point.x, point.y];
    } else {
        return point;
    }
}
