// import { $M } from 'sylvester';
declare var $M;

/**
 * TransformController base class for transforming shapes
 * @param $log
 * @param $scope
 * @constructor
 */
const TransformController = function($log, $scope) {

    this.scale = function(scaleX, scaleY, cx, cy) {
        // $log.debug("[TransformController] scaleX/Y: " + scaleX + ":" + scaleY + " cx/cy: " + cx + " : " + cy);
        const preshift = $M([[1, 0, -cx], [0, 1, -cy], [0, 0, 1]]);
        const scaled = $M([[scaleX, 0, 0], [0, scaleY, 0], [0, 0, 1]]);
        const postshift = $M([[1, 0, cx], [0, 1, cy], [0, 0, 1]]);

        $scope.data.matrix = postshift.x(scaled.x(preshift.x($scope.data.matrix)));
        $scope.$apply();

        this.setModified(true);
        $scope.update();
    };

    this.translate = function(dx, dy) {
        $log.debug(`[TransformController] translate: ${dx}: ${dy}`);
        const translateMatrix = $M([[1, 0, dx], [0, 1, dy], [0, 0, 1]]);
        $scope.data.matrix = translateMatrix.x($scope.data.matrix);
        $scope.$apply();

        this.setModified(true);
        $scope.update();
    };

    this.rotate  = function(angle, cx, cy) {
        $log.debug(`[TransformController] angle and center: ${angle} : ${cx} , ${cy}`);
        const angle_rad = Math.PI / 180 * angle;
        const sin = Math.sin(angle_rad);
        const cos = Math.cos(angle_rad);

        const preshift = $M([[1, 0, -cx], [0, 1, -cy], [0, 0, 1]]);
        const rotated = $M([[cos, -1 * sin, 0], [sin, cos, 0], [0, 0, 1]]);
        const postshift = $M([[1, 0, cx], [0, 1, cy], [0, 0, 1]]);

        $scope.data.matrix = postshift.x(rotated.x(preshift.x($scope.data.matrix)));
        $scope.$apply();

        this.setModified(true);
        $scope.update();
    };

    const init = function() {
        $log.debug('[TransformController] creating TransformController');
    };
    init();
};

import { shapesModule } from '../shapes.module';
shapesModule.controller('TransformController', ['$log', '$scope', TransformController]);
