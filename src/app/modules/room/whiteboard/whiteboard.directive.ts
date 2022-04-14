import * as _ from 'lodash';

/**
 * Whiteboard directive definition
 *
 * @param $log
 * @constructor
 */

const WhiteboardDirective = function (
    $log,
    $compile,
    dispatcherService,
    normalCoordinates,
    firebaseAppModel,
    remoteDispatcherService,
    whiteboardModel,
    RoomClickService,
    $timeout,
    plAppGlobal,
): ng.IDirective {

    return {
        restrict: 'E',
        require: 'whiteboard',
        transclude: true,
        template: require('./whiteboard.directive.html'),
        controller: 'whiteboardController',

        link: (scope: any, element, attrs, controller) => {

            const roomGlobal = plAppGlobal.getWindowGlobal();
            $log.debug('[WhiteboardDirective] link function(), scope: ', scope);

            scope.whiteboardActive = firebaseAppModel.app.whiteboardActive;

            /*******************************
             * Svg whiteboard elements
             ******************************/
            const svg: any = $(element).find('svg.whiteboard');
            scope.whiteboardModel.svgRoot = svg;
            const svgContent = $(element).find('.whiteboard-content');
            scope.whiteboardModel.svgContent = svgContent;

            /**
             * This is necessary to allow pencil strokes to begin inside of stamps.
             * See: https://bugzilla.mozilla.org/show_bug.cgi?id=511188
             */
            $(element).on('dragstart', (event) => {
                event.preventDefault();
            });

            scope.wbKeyDown = (event) => {
                const active = firebaseAppModel.app.whiteboardActive;
                if (active && event.key.toLowerCase() === 'backspace' ||
                    event.key.toLowerCase() === 'del' || event.key.toLowerCase() === 'delete') {
                    if (scope.whiteboardModel.getMode() === 'normal') {
                        whiteboardModel.deleteSelectedShapes();
                        event.preventDefault();
                    }
                } else if (active && event.key.toLowerCase() === 'escape') {
                    whiteboardModel.selectShape(null);
                    event.preventDefault();
                } else if (active && event.key === 'a' && (event.ctrlKey || event.metaKey)) {
                    whiteboardModel.selectAll();
                    event.preventDefault();
                } else if (event.key.toLowerCase() === 'shift') {
                    scope.whiteboardModel.whiteboard.shiftDown = true;
                }
            };

            scope.wbKeyUp = (event) => {
                if (event.key.toLowerCase() === 'shift') {
                    scope.whiteboardModel.whiteboard.shiftDown = false;
                }
            };

            /**
             * Communication with workspace
             */
            /*var workspaceFrameElement = document.getElementById('workspace');
            var workspaceFrame = workspaceFrameElement.contentWindow;

            var listener = null;
            var refreshListener  = function() {
                if(listener) {
                    remoteDispatcherService.deregisterListener(listener);
                }

                listener = remoteDispatcherService.registerListener(svg[0], workspaceFrame);
            };*/

            // element.on('$destroy', function() {
            //     remoteDispatcherService.deregisterListener(listener);
            // });

            // let watchActivity = function() {
            //     if (firebaseAppModel.app.activeActivity) {
            //         return firebaseAppModel.app.activeActivity.id;
            //     } else {
            //         return null;
            //     }
            // };
            // scope.$watch(watchActivity,refreshListener);

            /*******************************
             * Setup bindings
             *******************************/
            const setupListeners = function() {
                $log.debug('[WhiteboardDirective] setting up watch binding for elements.');
                dispatcherService.addListener('whiteboardChangeEvent', null, handleWhiteboardChange, this);
                dispatcherService.addListener('whiteboardSelectionChange', null, handleSelectionChange, this);
                dispatcherService.addListener(
                    'whiteboardInitialSelectionChange', null, handleInitialSelectionChange, this);
                dispatcherService.addListener('ShapeAnimationComplete', null, handleSelectionChange, this);
                dispatcherService.addListener('whiteboardStartTextEdit', null, editSelected, this);
            };

            /*******************************
             * Cursor
             *******************************/
            const contentCursorSrc = function() {
                return scope.whiteboardModel.whiteboard.contentCursor;
            };

            scope.$watch(contentCursorSrc, _.bind((newValue, oldValue) => {
                $log.debug('[WhiteboardDirective] content cursor src has changed:' + newValue);
                if (oldValue !== newValue) {
                    updateContentCursor(newValue);
                }
            },                                    this));

            /*******************************
             * RemoteShift (temporary fix PL-966; this informs the directive of shift clicks in the child iframes)
             *******************************/
            const remoteShiftClick = function() {
                return RoomClickService.shiftDown;
            };

            scope.$watch(remoteShiftClick, _.bind((newValue, oldValue) => {
                if (oldValue !== newValue) {
                    $log.debug('[WhiteboardDirective] shift key has changed in toys iframe :' + newValue);
                    scope.whiteboardModel.whiteboard.shiftDown = newValue;
                }
            },                                    this));

            function isBoardInteractive() {
                return (!(firebaseAppModel.app.activeActivity ||
                    firebaseAppModel.app.widgetsboardActive)) ||
                    scope.whiteboardModel.whiteboard.selectedTool.name !== 'LassoTool' ||
                    scope.whiteboardModel.whiteboard.selectedElements.length > 0 ||
                    scope.whiteboardSelectorModel.adjusting ||
                    scope.whiteboardModel.whiteboard.shiftDown;
            }

            /*******************************
             * Board Interaction Mode - If there is an active activity, if the user has a
             * non-pointer tool (drawing tool) or is using a selector to move/resize/rotate
             * something, or is using the pointer tool with the shift key down, then their mouse events
             * should be handled by the board. Otherwise, pointer-events on the board as a whole are
             * disabled, and the events go "through" the board to hit the workspace underneath.
             * (Shapes on the board always intercept mouse events)
             *******************************/
            scope.$watchGroup(['whiteboardModel.whiteboard.selectedTool.name', 'whiteboardSelectorModel.adjusting',
                'whiteboardModel.whiteboard.shiftDown', 'whiteboardModel.whiteboard.selectedElements',
                'firebaseAppModel.app.activeActivity', 'firebaseAppModel.app.widgetsboardActive',
            ],                (newVal, oldVal) => {
                scope.boardInteractionMode = isBoardInteractive();

                $log.debug('[WhiteboardDirective] boardInteractionMode changed:' + scope.boardInteractionMode);
            });

            const pointerMode = function() {
                return scope.whiteboardModel.whiteboard.selectedTool.name === 'LassoTool';
            };
            scope.$watch(pointerMode, (newValue) => {
                // we're shimming SVG elements to support toggle class (in LanguageMixins.js)
                // so we need to do the .each() iteration here instead of chaining toggleClass
                // directly on the selector.
                $('.shape').each((index, item) => {
                    $(item).toggleClass('whiteboard-pointer-mode', newValue);
                });
            });

            /*******************************
             * Whiteboard Deactivate
             *******************************/
            const whiteboardActive = function() {
                scope.whiteboardActive = firebaseAppModel.app.whiteboardActive;
                return firebaseAppModel.app.whiteboardActive;
            };

            scope.$watch(whiteboardActive, (newValue, oldValue) => {
                $log.debug('[WhiteboardDirective] whiteboardActive has changed:' + newValue);
                if (oldValue !== newValue) {
                    if (newValue !== true) {
                        cancelDrawing();
                    }
                }
                if (!newValue) {
                    $('whiteboard').trigger('closeAllDropdowns');
                }
            });

            /*******************************
             * Mouse Event handlers
             *******************************/
            const mousedown = function(event) {
                if (scope.whiteboardModel.getMode() === 'normal' &&
                    scope.whiteboardModel.whiteboard.creationStatus === 'ready') {
                    $log.debug('[WhiteboardDirective] mousedown');
                    clearLasso();

                    if (scope.whiteboardModel.whiteboard.selectedTool !== undefined) {
                        // start initial action
                        const position = normalCoordinates.getNormalizedCoordinates(event, svg[0]);

                        if (position) {
                            addNewElement(position.x, position.y);
                            $log.debug('[WhiteboardDirective] shape is active and inprogess...');
                            scope.whiteboardModel.whiteboard.creationStatus = 'inProgress';
                            $log.debug('[WhiteboardDirective] adding mouse handlers');
                            // attach handlers
                        }
                        svg.on('touchend', mouseup);
                        svg.on('touchmove', mousemove);
                        svg.on('mouseleave', mouseleave);
                        svg.on('mouseup', mouseup);
                        svg.on('mousemove', mousemove);
                    }
                }
            };

            const mouseleave = function(event) {
                mouseup(event);
            };

            const mousemove = function(event) {
                if (scope.whiteboardModel.getMode() === 'normal' ||
                     scope.whiteboardModel.whiteboard.shiftDown) {

                    const position = normalCoordinates.getNormalizedCoordinates(event, svg[0]);

                    scope.whiteboardModel.getActiveItem().updateShape(position.x, position.y, event.shiftKey);

                    update();
                }
            };

            const mouseup = function(event) {
                if (scope.whiteboardModel.getMode() === 'normal') {
                    $log.debug('[WhiteboardDirective] mouseup');
                    svg.off('touchend', mouseup);
                    svg.off('touchmove', mousemove);
                    svg.off('mouseleave', mouseleave);
                    svg.off('mouseup', mouseup);
                    svg.off('mousemove', mousemove);

                    if (scope.whiteboardModel.whiteboard.selectedElements.length > 0 &&
                        !scope.whiteboardModel.whiteboard.shiftDown) {
                        scope.whiteboardModel.clearSelection();
                    }

                    const activeItem = scope.whiteboardModel.getActiveItem();

                    if (activeItem) {
                        // LASSO TOOL BLOCK
                        if (scope.whiteboardModel.isWhiteboardSelectable()) {

                            const boundaryExtents = activeItem.getExtents();
                            const selectedShapes = [];
                            scope.whiteboardModel.whiteboard.elements.forEach((wbElement) => {
                                const wbElementController = scope.whiteboardModel.getLocalReference(wbElement.name);
                                const shapeExtents = wbElementController.getExtents();
                                if (isShapeInBox(shapeExtents, boundaryExtents)) {
                                    selectedShapes.push(wbElementController);
                                }
                            },                                                this);
                            scope.whiteboardModel.selectShapes(selectedShapes);
                            update();

                        } else {
                            // NORMAL SHAPES BLOCK
                            if (activeItem && activeItem.validateShape()) {
                                activeItem.getSvgElement().removeClass('shape-no-animate');
                                $log.debug('[WhiteboardDirective] mouseup: saving element');
                                // update the index again
                                activeItem.updateShapeProperty('index', scope.whiteboardModel.getIndex(), true);
                                try {
                                    scope.whiteboardModel.saveElement(activeItem.getShapeVO());
                                } catch (e) {
                                    // if there is an error saving an element, the only safe bet is to destroy it,
                                    // otherwise boards get out of sync. These errors are very sporadic, and seemed to
                                    // be caused by the fact that selection actions can occasionally lead to undefined
                                    // shape properties.
                                    $log.error('[WhiteboardDirective] Error saving element: ', activeItem.getShapeVO());
                                    $log.error('[WhiteboardDirective] with index: ', scope.whiteboardModel.getIndex());
                                    $log.error('[WhiteboardDirective] error: ', e);
                                    scope.whiteboardModel.destroyElement(activeItem);
                                    return;
                                }
                                $log.debug('[WhiteboardDirective] mouseup: selecting element');

                                if (scope.whiteboardModel.whiteboard.selectedTool.name === 'TextTool') {
                                    _.defer(_.bind(function() {
                                        scope.whiteboardModel.selectInitialShape(activeItem);
                                        update();

                                        _.defer(_.bind(() => {
                                            const shapeVO = activeItem.getShapeVO();
                                            if (shapeVO.type === 'text-shape') {
                                                startEditMode(activeItem);
                                            }
                                        },             this));
                                    },             this));
                                }
                                update();
                            } else {
                                // @see PL-398:
                                // as far as board capturing all events but we want to treat this as a click,
                                // which we want to bypass to an underlying elements,
                                // switch off board interaction mode
                                scope.boardInteractionMode = false;

                                $timeout(() => {
                                    // board assumed to be non-interactive now, so, let's look-up
                                    // for an underlying element which is under mouse cursor
                                    const x = event.pageX || event.clientX || event.x;
                                    const y = event.pageY || event.clientY || event.y;
                                    const el = document.elementFromPoint(x, y);

                                    // make sure we delegating click to widgets only
                                    if (!$(el).closest('.widgets-container').get(0)) {
                                        scope.boardInteractionMode = isBoardInteractive();
                                        return ;
                                    }

                                    $(el).one('click', () => {
                                        // make sure we restore board interactive mode after job done
                                        scope.boardInteractionMode = isBoardInteractive();
                                    });

                                    // emulate click on an underlying element,
                                    $(el).trigger('click');
                                },       100); // give some meaningful time to make sure DOM is ready
                                         // and interaction modde on board is off

                                $log.debug('[WhiteboardDirective] destroying invalid shape');
                                if (activeItem) {
                                    scope.whiteboardModel.removeLocalReference(activeItem);
                                    activeItem.destroyElement();
                                }
                            }
                        }
                    } else {
                        scope.whiteboardModel.clearSelection();
                    }
                    scope.whiteboardModel.whiteboard.creationStatus = 'ready';
                    scope.whiteboardModel.setActiveItemId(null);
                    clearLasso();
                }
            };

            const doubleclick = function(event) {
                $log.debug('[WhiteboardDirective] double click handler');
                if (scope.whiteboardModel.getMode() === 'normal') {
                    if (event.target.nodeName === 'rect' && _.includes(event.target.classList, 'moveHandle')) {
                        const selected = scope.whiteboardModel.whiteboard.selectedElements[0];
                        startEditMode(selected);
                    }
                    update();
                }
            };
            svg.on('mousedown', mousedown);
            svg.on('touchstart', mousedown);
            svg.on('dblclick', doubleclick);

            const cancelDrawing = function() {
                $log.debug('[WhiteboardDirective] cancel drawing');
                svg.off('mouseleave', mouseleave);
                svg.off('mouseup', mouseup);
                svg.off('touchend', mouseup);
                svg.off('mousemove', mousemove);
                svg.off('touchmove', mousemove);

                const activeItem = scope.whiteboardModel.getActiveItem();
                if (activeItem) {
                    scope.whiteboardModel.removeLocalReference(activeItem);
                    activeItem.destroyElement();
                } else {
                    scope.whiteboardModel.clearSelection();
                }
                scope.whiteboardModel.whiteboard.creationStatus = 'ready';
                scope.whiteboardModel.setActiveItemId(null);
                clearLasso();
            };

            /*******************************
             * Event handlers
             *******************************/
            const handleWhiteboardChange = function(event, data) {
                $log.debug(`[WhiteboardDirective] whiteboard change event: ${data.type} : ${data.name}`);

                if (data.type === 'child_added') {
                    childAdded(data.element);
                } else if (data.type === 'child_removed') {
                    childRemoved(data.element);
                } else if (data.type === 'child_changed') {
                    childChanged(data.element, data.localChange);
                } else if (data.type === 'child_moved') {
                    childMoved(data.element, data.prevChildId);
                } else if (data.type === 'value') {
                    valueChanged(data.element);
                }
            };

            const handleSelectionChange = function(event) {
                // just redraw when the selector updates
                scope.whiteboardModel.updateSelector();

                update();
            };

            const handleInitialSelectionChange = function(event) {
                // just redraw when the selector updates
                scope.whiteboardModel.updateSelector(true);

                update();
            };

            /*******************************
             * Collection mutation handlers
             *******************************/
            const childAdded = function(childElement) {
                $log.debug('[WhiteboardDirective] child added: ' + childElement.name);
                // if there is no local object, then create one
                const elementRef = scope.whiteboardModel.getLocalReference(childElement.name);
                if (elementRef === undefined) {
                    addElement(childElement, true);
                } else {
                    elementRef.setShapeVO(childElement);
                }
            };

            const childRemoved = function(childElement) {
                $log.debug('[WhiteboardDirective] child removed: ' + childElement.name);
                // this data object has already been removed remotely so delete the local objects
                const elementRef = scope.whiteboardModel.getLocalReference(childElement.name);
                removeElement(elementRef);
                // deselect all shapes
                scope.whiteboardModel.selectShape(null);
            };

            const childChanged = function(childElement, localChange) {
                $log.debug('[WhiteboardDirective] child changed: ' + childElement);
                // get the local reference and update it
                const elementRef = scope.whiteboardModel.getLocalReference(childElement.name);
                // note: firebase child_remove can be followed by child_changed events on the deleted items
                // we'll ignore those changes since we handle them in child_remove
                if (elementRef) {
                    if (localChange) {
                        elementRef.setShapeVO(childElement);
                    } else {
                        if (scope.whiteboardModel.getMode() === 'textedit') {
                            // if we're in textedit mode during a remote change then we'll skip animating the remote
                            // changes and any selection box updates. When the edit is completed any changes will
                            // overwrite conflicting values set here and all merged values will then be visible.
                            elementRef.setShapeVO(childElement);
                            return;
                        }
                        elementRef.animateShapeVO(childElement);

                    }
                }
                // update the selector in case a selected element was changed
                _.defer(() => {
                    if (localChange) {
                        scope.whiteboardModel.updateSelector();
                    } else {
                        scope.whiteboardModel.clearSelection();
                    }
                    update();
                });

                update();
            };

            const childMoved = function(childElement, prevChild) {
                $log.debug('[WhiteboardDirective] child moved: ' + childElement.name);
                const prevElementData = scope.whiteboardModel.getElementData(prevChild);
                const elementRef = svgContent.find('#' + childElement.name);

                if (prevElementData) {
                    const prevElement = svgContent.find('#' + prevElementData.name);
                    elementRef.insertAfter(prevElement);
                } else {
                    svgContent.prepend(elementRef);
                }

                update();
            };

            const valueChanged = function(childElement) {
                $log.debug('[WhiteboardDirective] value changed: ' + childElement);
            };

            /*******************************
             * Dom manipulation api
             *******************************/
            /**
             * Add a new local element (created locally)
             * @param startX
             * @param startY
             */
            const addNewElement = function(startX, startY) {
                const selectedTool = scope.whiteboardModel.whiteboard.selectedTool;
                $log.debug(
                    `[WhiteboardDirective] creating new ${selectedTool.name} element @ ${startX}: ${startY}`);
                const newScope = scope.$new();
                const data: any = {};

                _.defaults(data, _.clone(selectedTool.getDefaultSettings()));
                data.toolName = selectedTool.name;
                data.type = selectedTool.tagName;
                selectedTool.setStartPosition(data, startX, startY);
                data.name = scope.whiteboardModel.whiteboard.elements.generateId();
                data.index = scope.whiteboardModel.getIndex();
                newScope.data = data;
                $log.debug('[WhiteboardDirective] addNewElement data:' + JSON.stringify(data));
                scope.whiteboardModel.setActiveItemId(data.name);
                const newElement = createElement(newScope);
                newElement[0].addClass('shape-no-animate');
                insertElement(newScope, newElement);

                update();
            };

            /**
             * Add a new element (created remotely)
             * @param data
             */
            const addElement = function(data, applyNow) {
                $log.debug('[WhiteboardDirective] creating element');
                const newScope = scope.$new();
                newScope.data = _.clone(data);

                const newElement = createElement(newScope);
                insertElement(data, newElement);
                if (applyNow) {
                    update();
                }
                newScope.update();
            };

            /**
             * Remove element from the local ref store and destroy the element.
             * @param element
             */
            const removeElement = function(targetElement) {
                if (targetElement) {
                    $log.debug('[WhiteboardDirective] removing element: ' + targetElement.getShapeVO().name);
                    scope.whiteboardModel.removeLocalReference(targetElement);
                    targetElement.destroyElement();
                }
            };

            const createElement = function(newScope) {
                const newElTmpl = _.template('<<%= tag %>></<%= tag %>>');
                const newEl = $(newElTmpl({
                    tag: newScope.data.type,
                }));
                const linkFn = $compile(newEl[0]);
                const newElement = linkFn(newScope);
                newScope.update();
                return newElement;
            };

            /**
             * Insert element into the appropriate index of the svg content area.
             * @param data
             * @param element
             */
            const insertElement = function(data, targetElement) {
                const index = scope.whiteboardModel.getIndex(data.name);
                // $log.debug('[WhiteboardDirective] inserting new element with index: ' + index, element);
                const numElement = svgContent.children().length;
                if (pointerMode()) {
                    targetElement[0].addClass('whiteboard-pointer-mode');
                }
                if (index === numElement) {
                    svgContent.append(targetElement);
                } else {
                    targetElement.insertAt(index, svgContent);
                }
            };

            /*******************************
             * Edit Mode
             *******************************/
            /**
             * Enter edit mode (text shapes)
             */
            const startEditMode = function(item) {
                if (item && item.element && item.element[0].tagName === 'text') {
                    try {
                        const pt = normalCoordinates.getDenormalizedCoordinates(item, svg[0]);
                        const svgBounds =  svg[0].getBoundingClientRect();
                        const elementBounds = item.element[0].getBoundingClientRect();
                        const matrix = item.element[0].transform.baseVal.getItem(0).matrix;
                        const elementMetrics = {
                            x: pt.x,
                            y: pt.y,
                            scaleX: svgBounds.width / svg[0].viewBox.baseVal.width,
                            scaleY: svgBounds.height / svg[0].viewBox.baseVal.height,
                            textLength: item.element[0].getComputedTextLength(),
                            angle: Math.floor((Math.atan2(matrix.c, matrix.d) * 180 / Math.PI)) % 360,
                        };
                        scope.whiteboardModel.setMode('textedit');
                        scope.whiteboardSelectorModel.showSelector(false);
                        scope.whiteboardTextEditorModel.editShape(elementMetrics, item, elementBounds, svgBounds);
                        // when we start text editing, send a remote event saying so, so that hotkey bindings in
                        // remote frames can be disabled if necessary. PL-741
                        const textevent = remoteDispatcherService.createCustomEventObject(
                            'textedit', { editingText: true });
                        $(document).trigger(textevent);
                        $log.debug('[WhiteboardDirective] hiding svg shape');
                        $(item.getSvgElement()).hide();
                    } catch (exception) {
                        $log.debug(
                            `[WhiteboardDirective] startEditMode: exception trying to enter edit mode: ${exception}`);
                        return;
                    }
                }

            };

            const editSelected = function() {
                const selected = scope.whiteboardModel.whiteboard.selectedElements[0];
                startEditMode(selected);
            }

            /*******************************
             * Cursor functions
             *******************************/
            const updateContentCursor = function(src) {
                $log.debug('[WBDirective] updating cursor');
                if (src === null) {
                    showDefaultCursor();
                    removeCursorListeners();
                } else {
                    addCursorListeners();
                }
            };

            const addCursorListeners = function() {
                svg.on('mouseout', showDefaultCursor);
                svg.on('mouseenter', showCustomCursor);
                svg.on('mouseover', showCustomCursor);
                svg.on('mouseleave', showCustomCursor);
            };

            const removeCursorListeners = function() {
                svg.off('mouseout', showDefaultCursor);
                svg.off('mouseenter', showCustomCursor);
                svg.off('mouseover', showCustomCursor);
                svg.off('mouseleave', showCustomCursor);
            };

            const showDefaultCursor = function() {
                const cursorCss = {
                    cursor: 'auto',
                };
                svg.css(cursorCss);
            };

            const showCustomCursor = function() {
                const customCursor = scope.whiteboardModel.whiteboard.contentCursor;
                let cursorCss;
                if (customCursor.type === 'img') {
                    cursorCss = {
                        cursor: `url(${scope.whiteboardModel.whiteboard.contentCursor}), pointer`,
                    };
                } else if (customCursor.type === 'css') {
                    cursorCss = {
                        cursor: customCursor.cursor,
                    };
                }
                svg.css(cursorCss);
            };

            /*******************************
             * Misc utility functions
             *******************************/
            const clearLasso = function() {
                $('rect.lasso').remove();
            };

            const isPtInBox = function(targetExtents, pt) {
                return (
                    pt.x > targetExtents.x && pt.x < targetExtents.x + targetExtents.width &&
                    pt.y > targetExtents.y && pt.y < targetExtents.y + targetExtents.height
                );
            };

            const isShapeInBox = function(targetExtents, boundaryExtents) {
                return (
                    targetExtents.x > boundaryExtents.x && targetExtents.y > boundaryExtents.y &&
                    targetExtents.x + targetExtents.width < boundaryExtents.x + boundaryExtents.width &&
                    targetExtents.y + targetExtents.height < boundaryExtents.y + boundaryExtents.height
                );
            };

            const update = function() {
                scope.$evalAsync();
            };

            /*******************************
             * Initialize instance
             *******************************/
            const init = function() {
                $log.debug('[WhiteboardDirective] initializing whiteboard directive');
                setupListeners();
                whiteboardModel.initialize();
            };
            init();

        },

    };
};

import { whiteboardModule } from './whiteboard.module';

whiteboardModule.directive('whiteboard', [
    '$log',
    '$compile',
    'dispatcherService',
    'normalCoordinatesService',
    'firebaseAppModel',
    'remoteDispatcherService',
    'whiteboardModel',
    'RoomClickService',
    '$timeout',
    'plAppGlobal',
    WhiteboardDirective,
]);
