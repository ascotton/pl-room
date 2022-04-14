import * as angular from 'angular';

/**
 * Controller for the RectShape directive
 * @param $log
 * @param $scope
 * @constructor
 */
const TextShapeController = function($log, $scope, $controller, $element, whiteboardModel) {

    $scope.whiteboardModel = whiteboardModel;

    // mixins
    angular.extend(this, $controller('TransformController', { $scope }));
    angular.extend(this, $controller('ShapeController', { $scope, $element }));

    this.updateShape = function(x, y, constrain){
        $scope.data.x = x;
        $scope.data.y = y;

        $scope.update();
    };

    /**
     * Text is always valid
     * @returns {boolean}
     */
    this.validateShape = function() {
        return true;
    };

    const init = function() {
        $log.debug('[TextShapeController] creating TextShapeController');
    };
    init();
};

import { shapesModule } from '../shapes.module';
shapesModule.controller(
    'TextShapeController', ['$log', '$scope', '$controller', '$element', 'whiteboardModel', TextShapeController]);
