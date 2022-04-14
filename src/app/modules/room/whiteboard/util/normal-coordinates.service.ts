/**
 * Service for converting coordinates between browser impls
 *
 */
export class NormalCoordinatesService {

    constructor () {}

    /**
     * Retrieves the x,y of the event relative to the anchor element.
     * !!ABL: I'm assuming that the anchor is an SVG element
     *
     * @param event
     * @param anchor
     * @returns {{}}
     */
    getNormalizedCoordinates = function (event, anchor) {

        let pt = anchor.createSVGPoint();

        if (event.type.includes('touch')) {
            const touchEvent = event.originalEvent;
            const touch = touchEvent.touches[0];
            if (touch && touch.clientX && touch.clientY) {

                pt.x = touch.clientX;
                pt.y = touch.clientY;
                pt = pt.matrixTransform(anchor.getScreenCTM().inverse());

            } else {
                return null;
            }
        } else {
            if (!(event.clientX && event.clientY)) {
                return null;
            }

            pt.x = event.clientX;
            pt.y = event.clientY;
            pt = pt.matrixTransform(anchor.getScreenCTM().inverse());

        }

        return pt;
    };

    // given an element and the anchor, convert the elements x,y coordinates back to the html screen coordinate space
    // here's the inspiration:
    //      http://stackoverflow.com/questions/5834298/getting-the-screen-pixel-coordinates-of-a-rect-element
    getDenormalizedCoordinates = function (element, anchor) {
        const el = element.element[0];
        let pt = anchor.createSVGPoint();
        const matrix = el.getScreenCTM();
        pt.x = el.x.animVal[0].value;
        pt.y = el.y.animVal[0].value;
        pt = pt.matrixTransform(matrix);
        return pt;
    };
}

import { whiteboardModule } from '../whiteboard.module';
whiteboardModule.service('normalCoordinatesService', NormalCoordinatesService);
