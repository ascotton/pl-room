/**
 * Directive for rendering Line shapes
 *
 * @param $log
 * @constructor
 */
const LineShape = function($log) {
    return {
        restrict: 'E',
        replace: true,
        templateNamespace: 'svg',
        template:   '<line ' +
        '   class="shape"' +
        '></line>',
        controller  : 'LineShapeController',
        link : (scope, element, attr, controller) => {

            $log.debug('[LineShape] initializing LineShape directive.');
            scope.whiteboardModel.addLocalElement(controller);

            $(element).on('click', (event) => {
                $log.debug('[LineShape] click handler');
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
                element.attr('x1', scope.data.x1);
                element.attr('y1', scope.data.y1);
                element.attr('x2', scope.data.x2);
                element.attr('y2', scope.data.y2);
                element.attr('stroke', scope.data.color);
                element.attr('stroke-width', scope.data.strokeWidth);
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
shapesModule.directive('lineShape', ['$log', LineShape]);
