import * as angular from 'angular';

/**
 * Controller for the pencilShape directive
 * @param $log
 * @param $scope
 * @constructor
 */
const PencilShapeController = function($log, $scope, $controller, $element, whiteboardModel) {

    $scope.whiteboardModel = whiteboardModel;

    // mixins
    angular.extend(this, $controller('TransformController', { $scope }));
    angular.extend(this, $controller('ShapeController', { $scope, $element }));

    this.updateShape = function(x, y, constrain) {
        let reversed = '';
        let path = '';
        if ($scope.data.path === undefined) {
            reversed = '';
            path = `M ${$scope.data.startX} ${$scope.data.startY} `;
        } else {
            path = `${$scope.data.path}L ${x} ${y} `;
            const reversed_array = $scope.data.path.split('L ').reverse();

            reversed_array.pop();

            reversed = (reversed_array.length > 0) ? 'L ' + reversed_array.join('L ') : '';
        }

        $scope.data.path = path;
        $scope.data.d = path.concat(reversed);

        if (constrain) {
        }

        $scope.update();
    };

    /**
     * Any shape with path data is valid
     * @returns {boolean}
     */
    this.validateShape = function() {
        return $scope.data.d !== undefined;
    };

    const init = function() {
        $log.debug('[PencilShapeController] creating PencilShapeController');
    };
    init();
};

import { shapesModule } from '../shapes.module';
shapesModule.controller(
    'PencilShapeController', ['$log', '$scope', '$controller', '$element', 'whiteboardModel', PencilShapeController]);
