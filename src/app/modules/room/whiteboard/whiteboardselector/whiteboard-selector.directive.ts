let WhiteboardSelectorDirective;

WhiteboardSelectorDirective = function(
    $log,
    whiteboardModel,
    whiteboardSelectorModel,
    normalCoordinates,
){
    return {
        restrict    : 'E',
        templateNamespace : 'svg',
        replace     : true,
        template : require('./whiteboard-selector.directive.html'),
        link        : (scope, element, attrs, controllers) => {

            scope.model = whiteboardSelectorModel.selector;

            const MIN_WIDTH = 5;
            const MIN_HEIGHT = 5;

            let activeHandle = null;
            let startX = null;
            let startY = null;
            let offsetX = null;
            let offsetY = null;
            let lastAngle = 0;
            let mode = 'none';
            const body = $('body');

            const mousedown = function(event) {
                event.stopPropagation();
                whiteboardSelectorModel.adjusting = true;
                activeHandle = $(event.currentTarget).attr('handle-type');

                $(document).on('touchend', mouseup);
                $(document).on('touchmove', mousemove);
                $(document).on('mouseleave', mouseup);
                $(document).on('mouseup', mouseup);
                $(document).on('mousemove', mousemove);

                const mousePosition =
                    normalCoordinates.getNormalizedCoordinates(event, scope.whiteboardModel.svgRoot[0]);

                switch (activeHandle) {
                        case 'move':
                            startX = scope.model.x;
                            startY = scope.model.y;
                            offsetX = mousePosition.x - scope.model.x;
                            offsetY = mousePosition.y - scope.model.y;
                            break;
                        case 'rotate':
                            startX = mousePosition.x;
                            startY = mousePosition.y;
                            lastAngle = scope.model.angle;
                            body.addClass('cursor-rotate');
                            break;
                        case 'se':
                            body.addClass('cursor-resize-nwse');
                            break;
                        case 'nw':
                            body.addClass('cursor-resize-nwse');
                            break;
                        case 'ne':
                            body.addClass('cursor-resize-nesw');
                            break;
                        case 'sw':
                            body.addClass('cursor-resize-nesw');
                            break;
                }
            };

            const mouseup = function(event) {
                event.stopPropagation();
                whiteboardSelectorModel.adjusting = false;

                $(document).off('touchend', mouseup);
                $(document).off('touchmove', mousemove);
                $(document).off('mouseleave', mouseup);
                $(document).off('mouseup', mouseup);
                $(document).off('mousemove', mousemove);

                activeHandle = null;
                mode = 'none';
                whiteboardModel.updateModified();
                body.removeClass('cursor-rotate');
                body.removeClass('cursor-resize-nesw');
                body.removeClass('cursor-resize-nwse');
            };

            const mousemove = function(event) {
                event.stopPropagation();
                const constrain = event.shiftKey;
                let newWidth;
                let newHeight;

                const mousePosition =
                    normalCoordinates.getNormalizedCoordinates(event, scope.whiteboardModel.svgRoot[0]);

                if (mousePosition === null) {
                    return;
                }

                let width = scope.model.width;
                let height = scope.model.height;
                let x = scope.model.x;
                let y = scope.model.y;
                let dWidth = 1;
                let dHeight = 1;

                switch (activeHandle) {
                        case 'move':
                            moveSelectionHandler(mousePosition, constrain);
                            break;
                        case 'nw':
                            newWidth = (scope.model.width + scope.model.x) - mousePosition.x;
                            newHeight = (scope.model.height + scope.model.y) - mousePosition.y;

                            if (newWidth > MIN_WIDTH) {
                                width = newWidth;
                                dWidth = width / scope.model.width;
                                x = mousePosition.x;
                            }

                            if (newHeight > MIN_HEIGHT) {
                                height = newHeight;
                                dHeight = height / scope.model.height;
                                y = mousePosition.y;
                            }

                            if (constrain) {
                                const dX = mousePosition.x - scope.model.x;
                                const dY = mousePosition.y - scope.model.y;
                                const dim = dY;
                                x = scope.model.x + dim;
                                width = scope.model.width - dim;
                                height = scope.model.height - dim;
                                dWidth = width / scope.model.width;
                                dHeight = height / scope.model.height;
                            }

                            scope.model.width = width;
                            scope.model.height = height;
                            scope.model.x = x;
                            scope.model.y = y;
                            $log.debug(`[WhiteboardSelectorDirective] width: ${width} height: ${height}`);
                            whiteboardModel.scaleSelectedShapes(dWidth, dHeight, x + width, y + height);
                            break;
                        case 'ne':
                            newWidth = mousePosition.x - scope.model.x;
                            newHeight = scope.model.height + scope.model.y - mousePosition.y;

                            if (newWidth > MIN_WIDTH) {
                                width = newWidth;
                                dWidth = width / scope.model.width;
                            }

                            if (newHeight > MIN_HEIGHT) {
                                height = newHeight;
                                dHeight = height / scope.model.height;
                                y = mousePosition.y;
                            }

                            scope.model.width = width;
                            scope.model.height = height;
                            scope.model.x = x;
                            scope.model.y = y;
                            $log.debug(`[WhiteboardSelectorDirective] width: ${width} height: ${height}`);
                            whiteboardModel.scaleSelectedShapes(dWidth, dHeight, x, y + height);

                            break;
                        case 'sw':
                            newWidth = scope.model.width + scope.model.x - mousePosition.x;
                            newHeight = mousePosition.y - scope.model.y;

                            if (newWidth > MIN_WIDTH) {
                                width = newWidth;
                                dWidth = width / scope.model.width;
                                x = mousePosition.x;
                            }

                            if (newHeight > MIN_HEIGHT) {
                                height = newHeight;
                                dHeight = height / scope.model.height;
                            }

                            if (constrain) {
                                const dW = width - scope.model.width;
                                width = scope.model.width + dW;
                                height = scope.model.height + dW;
                                dWidth = width / scope.model.width;
                                dHeight = height / scope.model.height;
                            }

                            scope.model.width = width;
                            scope.model.height = height;
                            scope.model.x = x;
                            scope.model.y = y;
                            whiteboardModel.scaleSelectedShapes(dWidth, dHeight, x + width, y);
                            break;
                        case 'se':
                            newWidth = mousePosition.x - scope.model.x;
                            newHeight = mousePosition.y - scope.model.y;

                            if (newWidth > MIN_WIDTH) {
                                width = newWidth;
                                dWidth = width / scope.model.width;
                            }

                            if (newHeight > MIN_HEIGHT) {
                                height = newHeight;
                                dHeight = height / scope.model.height;
                            }

                            if (constrain) {
                                const dW = width - scope.model.width;
                                const dH = height - scope.model.height;
                                let dim;
                                if (Math.abs(dW) <= Math.abs(dH)) {
                                    dim = dW;
                                } else {
                                    dim = dH;
                                }
                                width = scope.model.width + dim;
                                height = scope.model.height + dim;
                                dWidth = width / scope.model.width;
                                dHeight = height / scope.model.height;
                            }

                            scope.model.width = width;
                            scope.model.height = height;
                            scope.model.x = x;
                            scope.model.y = y;
                            whiteboardModel.scaleSelectedShapes(dWidth, dHeight, x, y);
                            break;
                        case 'rotate':
                            $log.debug('[WhiteboardSelectorDirective] rotate()');
                            const calc: any = {};

                            calc.cx = scope.model.x + scope.model.width / 2;
                            calc.cy = scope.model.y + scope.model.height / 2;

                        // NOTE: since the rotate handle is on the 12oclock position, we calculate the
                        // angle of the mouse offset position relative to a vector at 0,1
                            calc.Ax = 0;
                            calc.Ay = 1;
                            calc.Bx = calc.cx - mousePosition.x;
                            calc.By = calc.cy - mousePosition.y;

                            calc.Alen = Math.sqrt(calc.Ax * calc.Ax + calc.Ay * calc.Ay);
                            calc.Blen = Math.sqrt(calc.Bx * calc.Bx + calc.By * calc.By);

                            calc.rads = Math.acos((calc.Ax * calc.Bx + calc.Ay * calc.By) / (calc.Alen * calc.Blen));
                            calc.degs = calc.rads * 180 / Math.PI;
                            $log.debug(
                                `rotate: degrees: ${calc.degs} offset.x: ${mousePosition.x} x: ${scope.model.x}`,
                            );
                            if (mousePosition.x < calc.cx) { // calc.cx is the center line
                                calc.degs = calc.degs * -1;
                            }
                            calc.angleDelta = calc.degs - lastAngle;
                            if (constrain) {
                            // find the nearest 45 deg angle
                                const remainder = Math.floor(calc.angleDelta) % 45;
                            // if we're within 10 degrees of it
                                if (Math.abs(remainder) < 10) {
                                // find the new delta
                                    const newDelta = Math.round(calc.angleDelta / 45) * 45;
                                // set the new angle
                                    scope.model.angle += newDelta;
                                    lastAngle = scope.model.angle;
                                    whiteboardModel.rotateSelectedShapes(newDelta, calc.cx, calc.cy);
                                }
                            }else {
                                lastAngle = calc.degs;
                                scope.model.angle += calc.angleDelta;

                                whiteboardModel.rotateSelectedShapes(calc.angleDelta, calc.cx, calc.cy);
                            }
                            break;
                }
                scope.$apply();
            };

            /**
             * handlers for the transform handles
             */
            const moveSelectionHandler = function(mousePosition, constrain) {
                // $log.debug("[WBSelectorDirective] moveSelectionHandler");
                // tslint:disable-next-line:one-variable-per-declaration
                let x, y, dx, dy, xDim, yDim, xDimAbs, yDimAbs;

                if (constrain) {
                    // constrain motion along x or y depending on the larger value
                    xDim = mousePosition.x - (startX + offsetX);
                    yDim = mousePosition.y - (startY + offsetY);
                    xDimAbs = Math.abs(xDim);
                    yDimAbs = Math.abs(yDim);

                    // we only constrain in one dimension per mouse down/up operation.
                    if (mode === 'none') {
                        if (xDimAbs >= yDimAbs) {
                            mode = 'x';
                        } else {
                            mode = 'y';
                        }
                    }

                    if (mode === 'x') {
                        x = mousePosition.x - offsetX;
                        y = scope.model.y;
                        dx = x - scope.model.x;
                        dy = 0;
                    } else if (mode === 'y') {
                        x = scope.model.x;
                        y = mousePosition.y - offsetY;
                        dx = 0;
                        dy = y - scope.model.y;
                    }

                } else {
                    // no constraints
                    x = mousePosition.x - offsetX;
                    y = mousePosition.y - offsetY;
                    dx = x - scope.model.x;
                    dy = y - scope.model.y;
                }

                scope.model.x = x;
                scope.model.y = y;
                whiteboardModel.moveSelectedShapes(dx, dy);

            };

            element.find('.handle').on('mousedown', mousedown);
            element.find('.handle').on('touchstart', mousedown);

        },
    };
};

import { whiteboardModule } from '../whiteboard.module';

const whiteboardSelectorDirective = whiteboardModule.directive('whiteboardSelector', [
    '$log',
    'whiteboardModel',
    'whiteboardSelectorModel',
    'normalCoordinatesService',
    WhiteboardSelectorDirective]);
