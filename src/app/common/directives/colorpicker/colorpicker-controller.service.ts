const ColorPickerController = function ($scope, $timeout) {
    this.setColor = function (color) {
        $scope.color = color;
        $timeout(
            () => {
                $scope.change();
            },
            0);
    };

    this.setVisible = function (value) {
        $scope.setVisible(value);
    };

};
import { commonDirectivesModule } from '../common-directives.module';

const colorPickerController = commonDirectivesModule.controller(
    'colorPickerController',
    ['$scope', '$timeout', ColorPickerController],
);
