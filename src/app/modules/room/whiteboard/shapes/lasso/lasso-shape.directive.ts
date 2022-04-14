/**
 * Directive for rendering the lasso selector
 *
 * @param $log
 * @constructor
 */
const LassoShape = function($log) {
    return {
        restrict: 'E',
        replace: true,
        templateNamespace: 'svg',
        template    :   '<rect ' +
        '   ng-show=" data.width > 10 || data.height > 10"' +
        '   class="lasso"' +
        '></rect>',
        controller  : 'LassoShapeController',
        link : (scope, element, attr, controller) => {
            $log.debug('[LassoShape] initializing LassoShape directive.');
            scope.whiteboardModel.addLocalElement(controller);

            // these are constants
            scope.renderSettings = {
                outline:    'black',
                dasharray: '',
                strokeWidth:     1,
                color:       'none',
                fillOpacity:     0,
            };

            scope.$on('$destroy', () => {
                element.remove();
            });

            scope.update = function() {
                element.attr('x', scope.data.x);
                element.attr('y', scope.data.y);
                element.attr('width', scope.data.width);
                element.attr('height', scope.data.height);
                element.attr('stroke', scope.renderSettings.outline);
                element.attr('stroke-width', scope.renderSettings.strokeWidth);
                element.attr('fill', scope.renderSettings.color);
                element.attr('fill-opacity', scope.renderSettings.fillOpacity);
                element.attr('stroke-dasharray', scope.renderSettings.dasharray);
            };
            scope.update();
        },

    };
};

import { shapesModule } from '../shapes.module';
shapesModule.directive('lassoShape', ['$log', LassoShape]);
