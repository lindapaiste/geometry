"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Range_1 = require("./Range");
var Dimensions_1 = require("../../window/Dimensions");
var ScalableBase_1 = require("./ScalableBase");
var TextMeasurer = /** @class */ (function () {
    function TextMeasurer() {
    }
    TextMeasurer.getCtx = function () {
        if (TextMeasurer.ctx === undefined) {
            TextMeasurer.canvas = document.createElement('canvas');
            TextMeasurer.ctx = getWidthOfText.c.getContext('2d');
        }
        return TextMeasurer.ctx;
    };
    TextMeasurer.getWidth = function (text, fontName, fontSize) {
        var ctx = TextMeasurer.getCtx();
        ctx.font = fontSize + 'px ' + fontName;
        return ctx.measureText(text).width;
    };
    return TextMeasurer;
}());
function getWidthOfText(text, fontName, fontSize) {
    if (getWidthOfText.c === undefined) {
        getWidthOfText.c = document.createElement('canvas');
        getWidthOfText.ctx = getWidthOfText.c.getContext('2d');
    }
    getWidthOfText.ctx.font = fontSize + 'px ' + fontName;
    return getWidthOfText.ctx.measureText(text).width;
}
var SizedText = /** @class */ (function (_super) {
    __extends(SizedText, _super);
    function SizedText(text, fontName, fontSize) {
        var _this = _super.call(this) || this;
        _this.scalableProperties = ['width', 'vw', 'fontSize'];
        _this.width = getWidthOfText(text, fontName, fontSize);
        _this.vw = 100 * _this.width / Dimensions_1.WINDOW_WIDTH;
        _this.fontSize = fontSize;
        return _this;
    }
    SizedText.prototype.scaleToWidth = function (width) {
        return this.scalePropertyToValue('width', width);
    };
    SizedText.prototype.scaleToVw = function (vw) {
        return this.scalePropertyToValue('vw', vw);
    };
    SizedText.prototype.scaleToFontSize = function (fontSize) {
        return this.scalePropertyToValue('fontSize', fontSize);
    };
    return SizedText;
}(ScalableBase_1.default));
var TextResizer = /** @class */ (function () {
    function TextResizer(_a) {
        var text = _a.text, _b = _a.fontName, fontName = _b === void 0 ? 'Georgia' : _b, baseSize = _a.baseSize, minWidth = _a.minWidth, maxWidth = _a.maxWidth, minVw = _a.minVw, maxVw = _a.maxVw, minFontSize = _a.minFontSize, maxFontSize = _a.maxFontSize;
        this.vwRange = new Range_1.default(minVw, maxVw);
        this.widthRange = new Range_1.default(minWidth, maxWidth);
        this.fontRange = new Range_1.default(minFontSize, maxFontSize);
        this.sized = new SizedText(text, fontName, baseSize);
    }
    TextResizer.prototype._forceValueToRange = function (propertyName, range) {
        this.sized = this.sized.scalePropertyToRange(propertyName, range);
    };
    //may yield unpredictable results if limits conflict with each other
    TextResizer.prototype.getSize = function () {
        this._forceValueToRange('width', this.widthRange);
        this._forceValueToRange('fontSize', this.fontRange);
        this._forceValueToRange('vw', this.vwRange);
        return this.sized.fontSize;
    };
    return TextResizer;
}());
exports.default = TextResizer;
