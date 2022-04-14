/**
 * Directive for rendering Ellipse shapes
 *
 * @param $log
 * @constructor
 */
const EllipseShape = function($log) {
    return {
        restrict: 'E',
        replace: true,
        templateNamespace: 'svg',
        template    :   '<ellipse ' +
        '   class="shape"' +
        '></ellipse>',
        controller  : 'EllipseShapeController',
        link : (scope, element, attr, controller) => {

            $log.debug('[EllipseShape] initializing EllipseShape directive.');
            scope.whiteboardModel.addLocalElement(controller);

            $(element).on('click', (event) => {
                $log.debug('[EllipseShape] click handler');
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
                element.attr('cx', scope.data.cx);
                element.attr('cy', scope.data.cy);
                element.attr('rx', scope.data.rx);
                element.attr('ry', scope.data.ry);
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
shapesModule.directive('ellipseShape', ['$log', EllipseShape]);
