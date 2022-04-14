import * as angular from 'angular';

/**
 * Controller for the StampShape directive
 * @param $log
 * @param $scope
 * @constructor
 */
const StampShapeController = function($log, $scope, $controller, $element, whiteboardModel) {

    $scope.whiteboardModel = whiteboardModel;

    // mixins
    angular.extend(this, $controller('TransformController', { $scope }));
    angular.extend(this, $controller('ShapeController', { $scope, $element }));

    const minimumDimension = 15;

    this.updateShape = function(x, y, constrain){
        const newWidth = Math.max(x - $scope.data.startX, minimumDimension);
        const newHeight = Math.max(y - $scope.data.startY, minimumDimension);

        if (constrain) {
            // set the width and height
            const newDimension = Math.max(Math.abs(newWidth), Math.abs(newHeight));
            $scope.data.width = $scope.data.height = newDimension;
        } else {
            $scope.data.width = newWidth;
            $scope.data.height = newHeight;
        }
        $scope.data.x = $scope.data.startX;
        $scope.data.y = $scope.data.startY;

        $scope.update();
    };

    /**
     * Any shape > zero is valid
     * @returns {boolean}
     */
    this.validateShape = function() {
        return $scope.data.stamp !== undefined;
    };

    const init = function() {
        $log.debug('[StampShapeController] creating StampShapeController');
    };
    init();
};

import { shapesModule } from '../shapes.module';
shapesModule.controller(
    'StampShapeController', ['$log', '$scope', '$controller', '$element', 'whiteboardModel', StampShapeController]);
