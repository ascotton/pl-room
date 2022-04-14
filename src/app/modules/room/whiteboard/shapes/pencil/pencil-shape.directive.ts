/**
 * Directive for rendering Pencil shapes
 *
 * @param $log
 * @constructor
 */
const PencilShape = function($log) {
    return {
        restrict: 'E',
        replace: true,
        templateNamespace: 'svg',
        template:   '<path ' +
        '   class="shape"' +
        '></path>',
        controller  : 'PencilShapeController',
        link : (scope, element, attr, controller) => {

            $log.debug('[PencilShape] initializing PencilShape directive.');
            scope.whiteboardModel.addLocalElement(controller);

            $(element).on('click', (event) => {
                $log.debug('[PencilShape] click handler');
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
                element.attr('d', scope.data.d);
                element.attr('stroke', scope.data.color);
                element.attr('stroke-width', scope.data.strokeWidth);
                element.attr('fill', scope.data.outline);
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
shapesModule.directive('pencilShape', ['$log', PencilShape]);
