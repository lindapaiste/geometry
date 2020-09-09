/**
 * static class needs to create a canvas/ctx, but can use the same one for all measurements
 */
class TextMeasurer {
    static canvas: HTMLCanvasElement;
    static ctx: CanvasRenderingContext2D;

    /**
     * return the class' static ctx property, creating it if it doesn not already exist
     */
    private static getCtx = (): CanvasRenderingContext2D => {
        if (TextMeasurer.ctx === undefined) {
            TextMeasurer.canvas = document.createElement('canvas');
            TextMeasurer.ctx = TextMeasurer.canvas.getContext('2d') as CanvasRenderingContext2D;
        }
        return TextMeasurer.ctx;
    };

    /**
     * public method gets the measurement for a text string with a given fontName and fontSize
     */
    public static getWidth = (text: string, fontName: string, fontSize: number): number => {
        const ctx = TextMeasurer.getCtx();
        ctx.font = fontSize + 'px ' + fontName;
        return ctx.measureText(text).width;
    }
}

/**
 * instead of exporting the class, just export the needed function
 */
export const getWidthOfText = TextMeasurer.getWidth;
