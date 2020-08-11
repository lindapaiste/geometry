import NumericRange from "../range/NumericRange";

const WINDOW_WIDTH = window.innerWidth;

// TODO: TESTING

function getWidthOfText(text, fontName, fontSize) {
  if (getWidthOfText.c === undefined) {
    getWidthOfText.c = document.createElement("canvas");
    getWidthOfText.ctx = getWidthOfText.c.getContext("2d");
  }
  getWidthOfText.ctx.font = fontSize + "px " + fontName;
  return getWidthOfText.ctx.measureText(text).width;
}

function convertSizeToVw(size) {
  const ratio = (100 * size) / WINDOW_WIDTH;
  // TODO: maybe don't use a string here
  // vw doesn't work on native
  return `${ratio}vw`;
}

class TextResizer {
  constructor({ text, fontName = "Georgia", baseSize, minWidth, maxWidth }) {
    this.baseWidth = getWidthOfText(text, fontName, baseSize);
    this.baseSize = baseSize;
    this.widthPerSize = this.baseWidth / baseSize;
    this.widthRange = new NumericRange(minWidth, maxWidth);
  }

  isValidWidth(width) {
    return this.widthRange.contains(width);
  }

  getSizeForWidth(width) {
    return width / this.widthPerSize;
  }

  maxSize() {
    return this.getSizeForWidth(this.widthRange.max);
  }

  minSize() {
    return this.getSizeForWidth(this.widthRange.min);
  }

  getSize() {
    if (this.isValidWidth(this.baseWidth)) {
      return this.baseSize;
    } else if (this.widthRange.isTooSmall(this.baseWidth)) {
      return this.minSize();
    } else if (this.widthRange.isTooLarge(this.baseWidth)) {
      return this.maxSize();
    }
  }
}

// name is 40px or 75% of width

export function getTitleNameSize(text) {
  const minWidth = 0;
  const maxWidth = 0.75 * WINDOW_WIDTH;
  const resizer = new TextResizer({
    text,
    fontName: "Georgia",
    baseSize: 40,
    minWidth,
    maxWidth,
  });
  return resizer.getSize();
}

export function getTitleNameSizeVw(text) {
  return convertSizeToVw(getTitleNameSize(text));
}

// title is 25px or 90-98% of width
export function getTitleSubSizeVw(text) {
  const minWidth = 0.9 * WINDOW_WIDTH;
  const maxWidth = 0.98 * WINDOW_WIDTH;
  const resizer = new TextResizer({
    text,
    fontName: "Georgia",
    baseSize: 25,
    minWidth,
    maxWidth,
  });
  const px = resizer.getSize();
  return convertSizeToVw(px);
}

export const adjustTextSize = ({
  text,
  minVw = 0,
  maxVw = 100,
  minPx,
  maxPx,
  baseSize,
}) => {
  // console.log({text, minVw, maxVw, minPx, maxPx, baseSize});
  // combine Vw and Px values to get the true min and max
  const minVwPx = convertVwToPx(minVw);
  const minWidth = minPx ? Math.max(minVwPx, minPx) : minVwPx;
  // console.log({minVwPx, minPx, minWidth});
  const maxVwPx = convertVwToPx(maxVw);
  const maxWidth = maxPx ? Math.min(maxVwPx, maxPx) : maxVwPx;
  // console.log({maxVwPx, maxPx, maxWidth});
  // use resizer class to handle computation
  const resizer = new TextResizer({
    text,
    fontName: "Georgia",
    baseSize,
    minWidth,
    maxWidth,
  });
  return resizer.getSize();
  // const px = resizer.getSize();
  // return convertSizeToVw( px );
};

function convertVwToPx(vw) {
  return (vw / 100) * WINDOW_WIDTH;
}
