import { Sized } from "..";
/**
 * takes the window in the constructor so that this class can be used inside of react hooks rather than relying on hooks
 */

export default class WindowTextSizer {
  public window: Sized;

  constructor(window: Sized) {
    this.window = window;
  }
}
