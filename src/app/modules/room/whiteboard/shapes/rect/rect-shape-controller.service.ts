import * as angular from 'angular';

/**
 * Controller for the RectShape directive
 * @param $log
 * @param $scope
 * @constructor
 */
const RectShapeController = function($log, $scope, $controller, $element, whiteboardModel) {

    $scope.whiteboardModel = whiteboardModel;

    // mixins
    angular.extend(this, $controller('TransformController', { $scope }));
    angular.extend(this, $controller('ShapeController', { $scope, $element }));

    this.updateShape = function(x, y, constrain){
        let newX = Math.min(x, $scope.data.startX);
        const newWidth = x - $scope.data.startX;
        let newY = Math.min(y, $scope.data.startY);
        const newHeight = y - $scope.data.startY;

        if (constrain) {
            // set the width and height
            const newDimension = Math.max(Math.abs(newWidth), Math.abs(newHeight));
            $scope.data.width = $scope.data.height = newDimension;
            // this will adjust the x,y to one of four places
            // a|b
            // ---
            // c|d
            if (newWidth < 0) {
                newX = $scope.data.startX - newDimension;
            } else {
                newX = $scope.data.startX;
            }

            if (newHeight < 0) {
                newY = $scope.data.startY - newDimension;
            } else {
                newY = $scope.data.startY;
            }

        } else {
            $scope.data.width = Math.abs(newWidth);
            $scope.data.height = Math.abs(newHeight);
        }
        $scope.data.x = newX;
        $scope.data.y = newY;

        // $log.debug("[RectSC] x, y, w, h: " + $scope.data.x + " , " + $scope.data.y + " , " + $scope.data.width +
        // " , " + $scope.data.height);
        $scope.update();
    };

    this.getNominalExtents = function() {
        const bb: any = {};
        const vo = this.getShapeVO();
        const offset = vo.strokeWidth / 2;
        bb.x = vo.x - offset;
        bb.y = vo.y - offset;
        bb.width  = vo.width + vo.strokeWidth;
        bb.height = vo.height + vo.strokeWidth;
        $log.debug(`[ShapeController] INITIAL getExtents() final bb w: ${bb.width} h: ${bb.height}`);
        return bb;
    };

    const init = function() {
        $log.debug('[RectShapeController] creating RectShapeController');
    };
    init();
};

import { shapesModule } from '../shapes.module';
shapesModule.controller(
    'RectShapeController', ['$log', '$scope', '$controller', '$element', 'whiteboardModel', RectShapeController]);
