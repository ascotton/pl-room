/**
 * Directive for rendering Text shapes
 *
 * @param $log
 * @constructor
 */
const TextShape = function($log) {
    return {
        restrict: 'E',
        replace: true,
        templateNamespace: 'svg',
        template: '<text></text>',
        controller: 'TextShapeController',
        link: (scope, element, attr, controller) => {

            $log.debug('[TextShape] initializing TextShape directive.');
            scope.whiteboardModel.addLocalElement(controller);

            scope.element = element;

            $(element).on('click', (event) => {
                $log.debug('[TextShape] click handler');
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
                element.attr('font-family', scope.data.fontFamily);
                element.attr('font-size', scope.data.fontSize);
                element.attr('stroke-width', scope.data.strokeWidth);
                element.attr('fill', scope.data.color);

                element.text(scope.data.message);

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
shapesModule.directive('textShape', ['$log', TextShape]);
