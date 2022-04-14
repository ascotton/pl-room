/**
 * Directive for rendering Rect shapes
 *
 * @param $log
 * @constructor
 */
const RectShape = function($log) {
    return {
        restrict: 'E',
        replace: true,
        templateNamespace: 'svg',
        template:   '<rect ' +
            '   class="shape"' +
           '></rect>',
        controller  : 'RectShapeController',
        link : (scope, element, attr, controller) => {

            $log.debug('[RectShape] initializing RectShape directive.');
            scope.whiteboardModel.addLocalElement(controller);

            $(element).on('click', (event) => {
                $log.debug('[RectShape] click handler');
                if (scope.whiteboardModel.isWhiteboardSelectable()) {
                    scope.whiteboardModel.selectShape(controller);
                    scope.$apply();
                }
            });

            scope.$on('$destroy', () => {
                element.remove();
            });

            scope.update = function() {
                element.attr('id', scope.data.name);
                element.attr('x', scope.data.x);
                element.attr('y', scope.data.y);
                element.attr('width', scope.data.width);
                element.attr('height', scope.data.height);
                element.attr('stroke', scope.data.outline);
                element.attr('stroke-width', scope.data.strokeWidth);
                element.attr('fill', scope.data.color);
                element.attr('opacity', scope.data.opacity);
                element.attr('stroke-dasharray', scope.data.dasharray);

                const cells = [];
                cells.push(scope.data.matrix.elements[0][0]);
                cells.push(scope.data.matrix.elements[1][0]);
                cells.push(scope.data.matrix.elements[0][1]);
                cells.push(scope.data.matrix.elements[1][1]);
                cells.push(scope.data.matrix.elements[0][2]);
                cells.push(scope.data.matrix.elements[1][2]);

                const matrix = `matrix(${cells.join(',')})`;
                element.attr('transform', matrix);
            };

        },

    };
};

import { shapesModule } from '../shapes.module';
shapesModule.directive('rectShape', ['$log', RectShape]);
