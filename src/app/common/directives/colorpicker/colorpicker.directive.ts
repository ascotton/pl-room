let ColorpickerDirective;

ColorpickerDirective = function () {
    return {
        replace: true,
        restrict: 'AE',
        scope: {
            color: '=',
            label: '@',
            change: '&',
        },
        controller: 'colorPickerController',
        template: require('./colorpicker.directive.html'),
        link: ($scope, $element) => {
            $scope.wheelVisible = false;
            $scope.hoverColor = '';

            const onDocumentClick = function (e) {
                if ($scope.wheelVisible) {
                    const clickInElement = $.contains($element[0], e.target) || $element.is(e.target);
                    if (!clickInElement) {
                        $scope.setVisible(false);
                        $scope.$apply();
                    }
                }
            };

            $scope.toggleVisible = function () {
                $scope.setVisible(!$scope.wheelVisible);
            };

            $scope.setVisible = function (val) {
                $scope.wheelVisible = val;
                if ($scope.wheelVisible) {
                    $(document).on('mousedown', onDocumentClick);
                } else {
                    $(document).off('mousedown', onDocumentClick);
                }
            };
        },
    };
};

import { commonDirectivesModule } from '../common-directives.module';
const colorpickerDirective = commonDirectivesModule.directive('colorpicker', ColorpickerDirective);
