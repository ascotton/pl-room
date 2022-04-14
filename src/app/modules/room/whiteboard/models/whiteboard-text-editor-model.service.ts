import * as _ from 'lodash';

/**
 * The state of the whiteboard text editor.
 * @param this.$log
 * @param dispatcherService
 */
class WhiteboardTextEditorModel {

    static $inject = ['$log', 'dispatcherService'];

    defaults = {
        angle: 0,
        x : 100,
        y: 100,
        width: 1,
        height: 1,
        initialWidth: 50,
        initialHeight: 48,
        size: 35,
        edgePadding: 5,
        visible: false,
    };

    editor = _.clone(this.defaults);

    constructor(private $log, private dispatcherService) {
        this.$log.debug('[WhiteboardTextEditorModel] creating model');
    }

    /**
     * Calculate the size and position of the text editor.
     *
     * This calculates the appropriate position and size of the text input. It will ensure that it
     * is within the visible whiteboard area and will adjust for angle, font, etc.
     *
     * For text that is not rotated (or out of bounds) we try our best to keep the text input in the same size/position
     * as the svg text for ease of use but it is occasionally off by a pixel or two
     * (see findFontBaselineAdjustedHeight below).
     *
     * For rotated text we place the input along the shape's left edge and center it vertically.
     *
     * For text off one or more edges of the wb, we bring the whole input inside the whiteboard area.
     *
     * @param shapeMetrics - derived properties of the svg shape (position, angle, etc)
     * @param shape - the actual shape
     * @param shapeBounds - the bounding box of the svg shape
     * @param svgBounds - the bounding box of the whiteboard svg
     */
    editShape = function(shapeMetrics, shape, shapeBounds, svgBounds) {
        this.$log.debug('[WhiteboardTextEditorModel] editShape()');
        if (shape) {
            const shapeVO = shape.getShapeVO();

            // set font styles
            this.editor.fontSize = shapeVO.fontSize * shapeMetrics.scaleX;
            this.editor.color = shapeVO.color;
            this.editor.fontFamily = shapeVO.fontFamily;

            // set content
            if (shapeVO.message === shapeVO.default) {
                // don't show default placeholder text in the text input
                this.editor.content = '';
            } else {
                this.editor.content = shapeVO.message;
            }

            // set size
            const bbox = shape.getExtents();
            let scaledHeight = bbox.height * shapeMetrics.scaleX;
            let scaledWidth = bbox.width; // we don't really ever care about measured width
            if (shapeMetrics.textLength === 0) { // text length tells us if this is an empty shape
                scaledWidth = this.editor.initialWidth;
                scaledHeight = this.editor.initialHeight;
            }

            // handle rotated shapes
            if (shapeMetrics.angle !== 0) { // angle of zero is upright normal text
                this.editor.width = this.editor.initialWidth;
                this.editor.height = this.editor.initialHeight;
                this.editor.x = shapeBounds.left; // match the left side
                this.editor.y = shapeBounds.top + ((shapeBounds.height - this.editor.height) / 2); // center vertically
            } else {
                this.editor.width = scaledWidth;
                this.editor.height = scaledHeight;
                this.editor.x = shapeMetrics.x;
                this.editor.y = shapeMetrics.y;
                // adjust for the svg text baseline
                this.editor.y -= this.findFontBaselineAdjustedHeight(this.editor.fontFamily, this.editor.height);
            }

            this.editor.lineHeight = this.editor.height;

            // set position
            // check if out of svgBounds horizontally
            const leftBounds = svgBounds.left + this.editor.edgePadding;
            const rightBounds = svgBounds.right - this.editor.edgePadding;
            if (this.editor.x < leftBounds || this.editor.x + this.editor.width > rightBounds) {
                // off the left side
                if (this.editor.x < leftBounds) {
                    this.editor.x = leftBounds;
                // off the right side
                } else {
                    // if the editor is right up against the right edge, move it over a little (50px)
                    // so it's easier to type into (e.g. you can see the text you type
                    this.editor.x = rightBounds - (this.editor.width + 50);
                }
            }
            // check if out of svgBounds vertically
            const upperBounds = svgBounds.top + this.editor.edgePadding;
            const lowerBounds = svgBounds.bottom - this.editor.edgePadding;
            if (this.editor.y <= upperBounds || this.editor.y + this.editor.height > lowerBounds) {
                // off the top
                if (this.editor.y <= upperBounds) {
                    this.editor.y = upperBounds;
                // off the bottom
                } else {
                    this.editor.y = lowerBounds - this.editor.height;
                }
            }

            // verify that the widths/heights aren't too big (> width) && boundaries
            if (this.editor.width >= svgBounds.width - this.editor.edgePadding * 2) {
                this.editor.width = svgBounds.width - this.editor.edgePadding * 2;
                this.editor.x = svgBounds.left + this.editor.edgePadding;
            } else {
                const widthDelta = (svgBounds.right - this.editor.edgePadding) - this.editor.x;
                this.editor.width = widthDelta;
            }

            // set visibility (show the editor)
            this.$log.debug('[WhiteboardTextEditorModel] setting editor visible');


            // JB 8-12-20 - have to override this and force minimum height for iPad
            if (this.editor.height < 48) {
                this.editor.height = 48;
            }

            this.editor.visible = true;

        } else {
            this.$log.debug('[WhiteboardTextEditorModel] setting editor default (not visible)');
            this.editor = _.clone(this.defaults);
        }
        this.dispatcherService.dispatch('whiteboardEditorChange', null, _.clone(this.editor));

    };

    /**
     * The y origin of svg text is the font baseline not the bottom of the text. This changes per font and isn't
     * readily accessible as a number via js, css, or the dom. Chrome lets us adjust the origin of svg text
     * see dominate-baseline or baseline-shift which entirely solves this problem and let's us match the text input
     * position to the text but firefox does not support any of those svg text attributes so here we are tying to
     * guess.
     *
     * The numbers below are empirically calculated to match the text at the initial scaling on Windows in Chrome
     * (our most common current user metrics). Verdana is the default font and we optimize around that.
     *
     * @returns {number}
     */
    findFontBaselineAdjustedHeight  = function(fontFamily, height) {
        // adjust to compensate for svg's baseline offset
        let offset = 0;
        // TODO these numbers probably need a little adjustment
        switch (fontFamily.split(',')[0]) {
                case 'Verdana':
                    offset = height * 0.82857;
                    break;
                case 'Georgia':
                    offset = height * 0.81;
                    break;
                case 'Palatino':
                    offset = height * 0.79;
                    break;
                case 'TimesNewRoman':
                    offset = height * 0.80;
                    break;
                case 'Arial':
                    offset = height * 0.79;
                    break;
                case 'Arial Black':
                    offset = height * 0.795;
                    break;
                case 'Comic Sans MS':
                    offset = height * 0.79;
                    break;
                case 'Impact':
                    offset = height * 0.82;
                    break;
                case 'Lucida Grande':
                    offset = height * 0.70;
                    break;
                case 'Tahoma':
                    offset = height * 0.82;
                    break;
                case 'Trebuchet MS':
                    offset = height * 0.81;
                    break;
                case 'Courier New':
                    offset = height * 0.74;
                    break;
                case 'Lucida Console':
                    offset = height * 0.79;
                    break;
                case 'Print Practice':
                    offset = height * 0.73;
                    break;
                default:
                    this.$log.debug('[WhiteboardTextEditorModel] font baseline unknown.');
                    offset = height * 0.82857; // verdana
        }
        this.$log.debug('[WhiteboardTextEditorModel] findFontBaselineAdjustedHeight: ' + offset);
        return offset;
    };
}

import { whiteboardcommonModelsModule } from './whiteboard-models.module';
whiteboardcommonModelsModule.service('whiteboardTextEditorModel', WhiteboardTextEditorModel);
