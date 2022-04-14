import * as angular from 'angular';

/**
 * Controller for the LassoShape directive
 * @param $log
 * @param $scope
 * @constructor
 */
const LassoShapeController = function($log, $scope, $controller, $element, whiteboardModel) {

    $scope.whiteboardModel = whiteboardModel;

    // mixins
    angular.extend(this, $controller('TransformController', { $scope }));
    angular.extend(this, $controller('ShapeController', { $scope, $element }));

    this.updateShape = function(x, y, constrain){
        const newX = Math.min(x, $scope.data.startX);
        const newWidth = Math.abs(x - $scope.data.startX);
        const newY = Math.min(y, $scope.data.startY);
        const newHeight = Math.abs(y - $scope.data.startY);

        $scope.data.x = newX;
        $scope.data.y = newY;
        $scope.data.width = newWidth;
        $scope.data.height = newHeight;

        if (constrain) {
        }
        $scope.update();
    };

    this.getExtents = function() {
        let obj = {};
        const defaultObj = {};
        if ($scope.data.width === 0 && $scope.data.height === 0) {
            obj = {
                angle   : $scope.data.angle,
                x       : $scope.data.x,
                y       : $scope.data.y,
                width   : 0,
                height  : 0,
            };
        }else {
            try {
                const extents = $element[0].getBBox();
                const strokeWidth = $scope.data.strokeWidth ? $scope.data.strokeWidth : 1;
                obj = {
                    angle   : $scope.data.angle,
                    x       : extents.x - strokeWidth / 2,
                    y       : extents.y - strokeWidth / 2,
                    width   : extents.width + strokeWidth,
                    height  : extents.height + strokeWidth,
                };
            } catch (e) {
                    // catch a bug in Firefox which throws a NS_ERROR_FAILURE when .getBBox() is called
                    // while clicking on the whiteboard (not on a shape).
                obj = defaultObj;
            }
        }
        return obj;
    };

    const init = function() {
        $log.debug('[LassoShapeController] creating LassoShapeController');
    };
    init();
};

import { shapesModule } from '../shapes.module';
shapesModule.controller(
    'LassoShapeController', ['$log', '$scope', '$controller', '$element', 'whiteboardModel', LassoShapeController]);
