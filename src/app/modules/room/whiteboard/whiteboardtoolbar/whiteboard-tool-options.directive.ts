import * as _ from 'lodash';

/**
 * Whiteboard directive definition
 *
 * @param $log
 * @constructor
 */

const WhiteboardToolOptionsDirective = function WhiteboardToolOptionsDirective(
    $log, whiteboardModel, rectTool,
    ellipseTool, webSafeFontsService, dispatcherService) {
    return {
        restrict: 'E',
        replace: true,
        template: require('./whiteboard-tool-options.directive.html'),

        link: function WhiteboardToolOptionsDirectiveLink(scope) {
            $log.debug('[WhiteboardToolOptionsDirective] link function()');
            scope.whiteboardModel = whiteboardModel;
            scope.linestyles = ['', '3,11', '5,11', '10,11'];
            scope.fonts = webSafeFontsService;
            scope.fonts.push({
                name: 'Print Practice',
                family: 'Print Practice',
            });
            scope.fonts = _.sortBy(scope.fonts, (font: any) => font.name);
            scope.rectTool = rectTool;
            scope.ellipseTool = ellipseTool;
            scope.activeProperties = [];

            scope.toolIn = function toolIn(...toolNames) {
                if (whiteboardModel.whiteboard.selectedTool &&
                    toolNames.indexOf(whiteboardModel.whiteboard.selectedTool.name) >= 0) {
                    return true;
                }
                return whiteboardModel.whiteboard.selectedElements.some((selectedTool) => {
                    const vo = selectedTool.getShapeVO();
                    return vo.toolName && toolNames.indexOf(vo.toolName) >= 0;
                });
            };

            scope.getActiveProperties = () => {
                let props = [];
                if (whiteboardModel.whiteboard.selectedTool &&
                    whiteboardModel.whiteboard.selectedTool.name === 'LassoTool' &&
                    whiteboardModel.whiteboard.selectedElements.length > 0) {
                    // if only one selected item
                    if (whiteboardModel.whiteboard.selectedElements.length === 1) {
                        props = _.keys(whiteboardModel.whiteboard.selectedElements[0].getShapeVO());
                        // if multiple selected items
                    } else {
                        const propArrys = [];
                        _.each(whiteboardModel.whiteboard.selectedElements, (el) => {
                            const selectedProps = _.keys(el.getShapeVO());
                            propArrys.push(selectedProps);
                        });
                        props = _.intersection.apply(_, propArrys);
                    }
                } else {
                    if (whiteboardModel.whiteboard.selectedTool) {
                        props = whiteboardModel.whiteboard.selectedTool.properties;
                    }
                }
                return props;
            };

            scope.hasActiveProperty = prop => _.indexOf(scope.activeProperties, prop) >= 0;

            scope.getActiveProperty = (property) => {
                let value;
                if (whiteboardModel.whiteboard.selectedTool &&
                    _.indexOf(whiteboardModel.whiteboard.selectedTool.properties, property) >= 0) {
                    value = whiteboardModel.whiteboard.selectedTool.settings[property];
                } else {
                    // if the property is not on the tool get the value from the element
                    if (whiteboardModel.whiteboard.selectedElements.length > 0) {
                        value = whiteboardModel.whiteboard.selectedElements[0].getShapeVO()[property];
                    }
                }
                return value;
            };

            scope.handleToolChange = () => {
                scope.activeProperties = scope.getActiveProperties();
            };

            scope.addListeners = () => {
                dispatcherService.addListener('whiteboardToolChangeEvent', null, scope.handleToolChange, this);
                dispatcherService.addListener('whiteboardSelectionChange', null, scope.handleToolChange, this);
                dispatcherService.addListener('whiteboardInitialSelectionChange', null, scope.handleToolChange, this);
                dispatcherService.addListener('whiteboardSelectionClear', null, scope.handleToolChange, this);
            };

            scope.showStampMenu = () =>
            scope.hasActiveProperty('stamp') && whiteboardModel.whiteboard.selectedTool.name !== 'LassoTool';

            /* ******************************
             * Initialize instance
             *******************************/
            const init = () => {
                $log.debug('[WhiteboardToolOptionsDirective] initializing directive');
                scope.addListeners();
            };
            init();
        },
    };
};

import { whiteboardToolbarModule } from './whiteboard-toolbar.module';
const whiteboardToolOptions = whiteboardToolbarModule.directive(
    'whiteboardToolOptions',
    ['$log', 'whiteboardModel', 'rectTool', 'ellipseTool', 'webSafeFontsService',
        'dispatcherService', WhiteboardToolOptionsDirective]);
