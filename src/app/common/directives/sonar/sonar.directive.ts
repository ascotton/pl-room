import { commonDirectivesModule } from '../common-directives.module';

const SonarDirective = function() {
    return {
        restrict: 'E',
        scope : {},
        template: require('./sonar.directive.html'),
        link: ($scope, $element) => {

            function removeElement() {
                $scope.$destroy();
                $element.remove();
            }

            function initialize() {
                const animatedDiv = $element.find('.sonar')[0];
                animatedDiv.addEventListener('animationend', removeElement, false);
            }
            initialize();
        },
    };
};

commonDirectivesModule.directive('sonar', [
    SonarDirective,
]);
