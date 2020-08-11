import NumericRange from "./NumericRange";
import { ScaledVersionCreator } from "./ScaledVersion";
var createTextSize = function (text, fontName, fontSize, windowWidth) {
  var width = TextMeasurer.getWidth(text, fontName, fontSize);
  return {
    width: width,
    vw: (100 * width) / windowWidth,
    fontSize: fontSize,
  };
};
//could make TextSize a class with lots of setters for inter-related properties, but don't need to
export var fitTextToSize = function (props) {
  var text = props.text,
    _a = props.fontName,
    fontName = _a === void 0 ? "Georgia" : _a,
    baseSize = props.baseSize,
    minWidth = props.minWidth,
    maxWidth = props.maxWidth,
    minVw = props.minVw,
    maxVw = props.maxVw,
    minFontSize = props.minFontSize,
    maxFontSize = props.maxFontSize,
    windowWidth = props.windowWidth;
  var textSize = createTextSize(text, fontName, baseSize, windowWidth);
  var getScaledToProperty = function (property, range) {
    //need to create a new calculator after each change in order to apply changes to the previously edited
    var scaleCalc = new ScaledVersionCreator(
      ["width", "vw", "fontSize"],
      textSize
    );
    return scaleCalc.scalePropertyToRange(property, range);
  };
  //may yield unpredictable results if limits conflict with each other
  textSize = getScaledToProperty("vw", new NumericRange(minVw, maxVw));
  textSize = getScaledToProperty("width", new NumericRange(minWidth, maxWidth));
  textSize = getScaledToProperty(
    "width",
    new NumericRange(minFontSize, maxFontSize)
  );
  return textSize;
};
var TextMeasurer = /** @class */ (function () {
  function TextMeasurer() {}
  TextMeasurer.getCtx = function () {
    if (TextMeasurer.ctx === undefined) {
      TextMeasurer.canvas = document.createElement("canvas");
      TextMeasurer.ctx = TextMeasurer.canvas.getContext("2d");
    }
    return TextMeasurer.ctx;
  };
  TextMeasurer.getWidth = function (text, fontName, fontSize) {
    var ctx = TextMeasurer.getCtx();
    ctx.font = fontSize + "px " + fontName;
    return ctx.measureText(text).width;
  };
  return TextMeasurer;
})();
export var getWidthOfText = TextMeasurer.getWidth;
//# sourceMappingURL=TextResizer.js.map
