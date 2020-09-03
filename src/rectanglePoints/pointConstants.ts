import {CenterPoint, CornerPoint, IPointName, MidPoint, XName, YName} from "./types";

export const CENTER: IPointName & CenterPoint = {
    xName: "xmid",
    yName: "ymid",
}

export const CORNERS: (IPointName & CornerPoint)[] = [
    {xName: "x1", yName: "y1"},
    {xName: "x1", yName: "y2"},
    {xName: "x2", yName: "y1"},
    {xName: "x2", yName: "y2"},
];

export const MIDPOINTS: (IPointName & MidPoint)[] = [
    {xName: "x1", yName: "ymid"},
    {xName: "x1", yName: "ymid"},
    {xName: "xmid", yName: "y1"},
    {xName: "xmid", yName: "y2"},
];

export const XNAMES: XName[] = ["x1", "x2", "xmid"];

export const YNAMES: YName[] = ["y1", "y2", "ymid"];
