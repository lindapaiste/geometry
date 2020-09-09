import NumericRange from "../range/NumericRange";
import ScaledVersionCreator from "../scaling/ScaledVersion";
import {getWidthOfText} from "./getWidthOfText";

export interface TextResizerProps {
    text: string,
    fontName?: string,
    baseSize: number,
    minWidth?: number,
    maxWidth?: number,
    minVw?: number,
    maxVw?: number,
    minFontSize?: number,
    maxFontSize?: number,
    windowWidth: number,
}

export interface TextSize {
    width: number;
    vw: number;
    fontSize: number;
}

const createTextSize = (text: string, fontName: string, fontSize: number, windowWidth: number): TextSize => {
    const width = getWidthOfText(text, fontName, fontSize);
    return {
        width,
        vw: 100 * width / windowWidth,
        fontSize,
    }
};

// could make TextSize a class with lots of setters for inter-related properties, but don't need to

export const fitTextToSize = (props: TextResizerProps): TextSize => {
    const {
        text,
        fontName = 'Georgia',
        baseSize,
        minWidth,
        maxWidth,
        minVw,
        maxVw,
        minFontSize,
        maxFontSize,
        windowWidth,
    } = props;

    let textSize = createTextSize(text, fontName, baseSize, windowWidth);

    const getScaledToProperty = (property: keyof TextSize, range: NumericRange): TextSize => {
        // need to create a new calculator after each change in order to apply changes to the previously edited
        const scaleCalc = new ScaledVersionCreator(['width', 'vw', 'fontSize'], textSize);
        return scaleCalc.scalePropertyToRange(property, range);
    };

    // may yield unpredictable results if limits conflict with each other
    textSize = getScaledToProperty('vw', new NumericRange(minVw, maxVw));
    textSize = getScaledToProperty('width', new NumericRange(minWidth, maxWidth));
    textSize = getScaledToProperty('width', new NumericRange(minFontSize, maxFontSize));

    return textSize;

};

