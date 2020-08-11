import { XNames, YNames } from "./enums";
import { PointNameTuple } from "./name-tuples";
import { IPointName, IRectanglePoint } from "./types";
import { oppositePointName } from "./opposites";

/**
 * each point has x and y coordinates and also a name determining where it is on the rectangle
 * the primary purpose of this class is to facilitate getting the name/location of the opposite point
 * but that calculation is all static
 */

export default class RectanglePoint implements IRectanglePoint {
  public readonly x: number;
  public readonly y: number;
  public readonly xName: XNames;
  public readonly yName: YNames;
  public readonly opposite: IPointName;

  constructor(props: IRectanglePoint) {
    this.x = props.x;
    this.y = props.y;
    this.xName = props.xName;
    this.yName = props.yName;
    this.opposite = oppositePointName(props);
  }

  pointName(): PointNameTuple {
    return [this.xName, this.yName];
  }

  oppositePointName(): PointNameTuple {
    return [this.opposite.xName, this.opposite.yName];
  }

  get key(): string {
    return this.xName + "," + this.yName;
  }

  clone(): RectanglePoint {
    return new RectanglePoint(this);
  }
}
