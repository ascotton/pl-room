import * as angular from 'angular';

/**
 * Controller for the Line Shape directive
 * @param $log
 * @param $scope
 * @constructor
 */
const LineShapeController = function($log, $scope, $controller, $element, whiteboardModel) {

    $scope.whiteboardModel = whiteboardModel;

    // mixins
    angular.extend(this, $controller('TransformController', { $scope }));
    angular.extend(this, $controller('ShapeController', { $scope, $element }));

    this.updateShape = function(x, y, constrain) {
        if ($scope.data.x1 === undefined || $scope.data.y1 === undefined) {
            $scope.data.x1 = $scope.data.startX;
            $scope.data.y1 = $scope.data.startY;
        }

        if (constrain) {

            // which is longer? x or y
            const xDim = x - $scope.data.x1;
            const yDim = y - $scope.data.y1;
            const xDimAbs = Math.abs(xDim);
            const yDimAbs = Math.abs(yDim);

            $log.debug(`xDimAbs: ${xDimAbs} yDimAbs: ${yDimAbs} xDim: ${xDim} yDim: ${yDim}`);
            // draw horizontal
            if (xDimAbs >= yDimAbs) {
                if (yDimAbs >= xDimAbs / 2) {
                    // draw 45 degrees
                    if (yDim < 0 && xDim > 0) {
                        $scope.data.x2 = $scope.data.x1 + xDimAbs;
                        $scope.data.y2 = $scope.data.y1 - xDimAbs;
                    } else if (yDim > 0 && xDim > 0) {
                        $scope.data.x2 = $scope.data.x1 + xDimAbs;
                        $scope.data.y2 = $scope.data.y1 + xDimAbs;
                    } else if (yDim > 0 && xDim < 0) {
                        $scope.data.x2 = $scope.data.x1 - xDimAbs;
                        $scope.data.y2 = $scope.data.y1 + xDimAbs;
                    } else if (yDim < 0 && xDim < 0) {
                        $scope.data.x2 = $scope.data.x1 - xDimAbs;
                        $scope.data.y2 = $scope.data.y1 - xDimAbs;
                    }
                } else {
                    $scope.data.x2 = $scope.data.x1 + xDim;
                    $scope.data.y2 = $scope.data.y1;
                }
            // draw vertical
            } else {
                $scope.data.x2 = $scope.data.x1;
                $scope.data.y2 = $scope.data.y1 + yDim;
            }

        } else {
            $scope.data.x2 = x;
            $scope.data.y2 = y;
        }

        $scope.update();
    };

    /**
     * Any shape > 0 is valid
     * @returns {boolean}
     */
    this.validateShape = function() {
        const valid = Math.abs($scope.data.x1 - $scope.data.x2) > 0 ||
                    Math.abs($scope.data.y1 - $scope.data.y2) > 0;
        return valid;
    };

    const init = function() {
        $log.debug('[LineShapeController] creating LineShapeController');
    };
    init();
};

import { shapesModule } from '../shapes.module';
shapesModule.controller(
    'LineShapeController', ['$log', '$scope', '$controller', '$element', 'whiteboardModel', LineShapeController]);
