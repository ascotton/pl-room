// 'use strict';
// declare var blah;
const x = 555;

const WhiteboardToolSelectDirective = function(
    $log, whiteboardModel, lassoTool, pencilTool, rectTool,
    ellipseTool, lineTool, textTool, stampTool, webSafeFontsService): ng.IDirective {

    return {
        restrict: 'E',
        replace: true,
        template: require('./whiteboard-tool-select.directive.html'),

        link: (scope: any, element, attrs) => {
            $log.debug('[WhiteboardUpperToolbarDirective] link function()');

            scope.whiteboardModel = whiteboardModel;
            scope.lassoTool = lassoTool;
            scope.pencilTool = pencilTool;
            scope.lineTool = lineTool;
            scope.textTool = textTool;
            scope.stampTool = stampTool;

            scope.isToolActive = function(tool) {
                return whiteboardModel.whiteboard.selectedTool === tool;
            };

            scope.selectTool = function(tool) {
                if (scope.whiteboardModel.whiteboard.creationStatus === 'ready') {
                    whiteboardModel.setSelectedTool(tool);
                    if (tool.name === 'StampTool') {
                        whiteboardModel.setContentCursor(stampTool.cursor);
                    }
                }
            };

            scope.selectShape = function(tool) {
                if (scope.whiteboardModel.whiteboard.creationStatus === 'ready') {
                    whiteboardModel.setSelectedTool(tool);
                }
            };

            scope.isShapeToolActive = function() {
                return whiteboardModel.whiteboard.selectedTool === rectTool ||
                    whiteboardModel.whiteboard.selectedTool === ellipseTool;
            };

            /*******************************
             * Initialize instance
             *******************************/
            const init = function() {
                $log.debug('[WhiteboardUpperToolbarDirective] initializing directive');
            };
            init();

        },
    };
};

import { whiteboardToolbarModule } from './whiteboard-toolbar.module';

const whiteboardToolSelectDirective = whiteboardToolbarModule.directive(
    'whiteboardToolSelect',
    ['$log', 'whiteboardModel', 'lassoTool', 'pencilTool', 'rectTool',
        'ellipseTool', 'lineTool', 'textTool', 'stampTool', 'webSafeFontsService',
        'dispatcherService', WhiteboardToolSelectDirective]);
