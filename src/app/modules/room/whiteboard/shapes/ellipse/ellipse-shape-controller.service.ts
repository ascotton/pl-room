import * as angular from 'angular';

/**
 * Controller for the EllipseShape directive
 * @param $log
 * @param $scope
 * @constructor
 */
const EllipseShapeController = function($log, $scope, $controller, $element, whiteboardModel) {

    $scope.whiteboardModel = whiteboardModel;

    // mixins
    angular.extend(this, $controller('TransformController', { $scope }));
    angular.extend(this, $controller('ShapeController', { $scope, $element }));

    this.updateShape = function(x, y, constrain) {
        const newX = Math.min(x, $scope.data.startX);
        const newWidth = x - $scope.data.startX;
        const newY = Math.min(y, $scope.data.startY);
        const newHeight = y - $scope.data.startY;

        // $log.debug("[EllipseSC] updateShape() startX, newX, newY, newWidth, newHeight: " +
        // $scope.data.startX + " , " + newX + " , " + newY + " , " + newWidth + " , " + newHeight);

        if (constrain) {

            // set the width and height to the largest dimension
            const newDimension = Math.max(Math.abs(newWidth), Math.abs(newHeight));
            $scope.data.rx = Math.abs(Math.abs(newDimension) / 2 - $scope.data.strokeWidth / 2);
            $scope.data.ry = Math.abs(Math.abs(newDimension) / 2 - $scope.data.strokeWidth / 2);

            if (newWidth < 0) {
                $scope.data.cx = $scope.data.startX - Math.abs(newDimension) / 2;
            } else {
                $scope.data.cx = $scope.data.startX + Math.abs(newDimension) / 2;
            }

            if (newHeight < 0) {
                $scope.data.cy = $scope.data.startY - Math.abs(newDimension) / 2;
            } else {
                $scope.data.cy = $scope.data.startY + Math.abs(newDimension) / 2;
            }

        } else {
            $scope.data.rx = Math.abs(Math.abs(newWidth) / 2 - $scope.data.strokeWidth / 2);
            $scope.data.ry = Math.abs(Math.abs(newHeight) / 2 - $scope.data.strokeWidth / 2);
            $scope.data.cx = newX + Math.abs(newWidth) / 2;
            $scope.data.cy = newY + Math.abs(newHeight) / 2;
        }

        $scope.update();
        // $log.debug("[EllipseSC] updateShape() cx, cy, rx, ry: " + $scope.data.cx + " , " + $scope.data.cy + " , " +
        // $scope.data.rx + " , " + $scope.data.ry);
    };

    this.getNominalExtents = function() {
        const bb: any = {};
        const vo = this.getShapeVO();
        bb.x = (vo.cx - vo.rx) - vo.strokeWidth / 2;
        bb.y = (vo.cy - vo.ry) - vo.strokeWidth / 2;
        bb.width  = vo.rx * 2 + vo.strokeWidth;
        bb.height = vo.ry * 2 + vo.strokeWidth;
        return bb;
    };

    /**
     * Any shape > zero is valid
     * @returns {boolean}
     */
    this.validateShape = function() {
        return Math.abs($scope.data.cx - $scope.data.rx) > 0;
    };

    const init = function() {
        $log.debug('[EllipseShapeController] creating EllipseShapeController');
    };
    init();
};

import { shapesModule } from '../shapes.module';
shapesModule.controller(
    'EllipseShapeController',
    ['$log', '$scope', '$controller', '$element', 'whiteboardModel', EllipseShapeController],
);
