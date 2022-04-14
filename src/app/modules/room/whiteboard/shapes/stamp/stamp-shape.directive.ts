/**
 * Directive for rendering Stamp shapes
 *
 * @param $log
 * @constructor
 */
const StampShape = function($log, stampModel) {
    return {
        restrict: 'E',
        replace: true,
        templateNamespace: 'svg',
        template:   '<image ' +
            '   class="shape"' +
            '   xlink:href="this-needs-a-dummy-value"' +
            '   preserveAspectRatio="none"' +
            '></image>',
        controller  : 'StampShapeController',
        link : (scope, element, attr, controller) => {

            $log.debug('[StampShape] initializing StampShape directive.');
            scope.whiteboardModel.addLocalElement(controller);

            $(element).on('click', (event) => {
                $log.debug('[StampShape] click handler');
                if (scope.whiteboardModel.isWhiteboardSelectable()) {
                    scope.whiteboardModel.selectShape(controller);
                    scope.$apply();
                }
            });

            const getSvgPath = () => {
                let path: string = scope.data.stamp.svg;
                if (!path.includes('amazonaws')) {
                    const root = `https://cdn.presencelearning.com/emoji/`;
                    const filenameIndex = path.lastIndexOf('/');
                    path = root + path.slice(filenameIndex + 1).toLowerCase();
                }
                return path;
            }

            scope.update = function() {
                element.attr('id', scope.data.name);
                element.attr('x', scope.data.x);
                element.attr('y', scope.data.y);
                element.attr('width', scope.data.width);
                element.attr('height', scope.data.height);
                element.attr('opacity', scope.data.opacity);
                if (scope.data.stamp) {
                    let svgPath = getSvgPath();
                    element.attr('xlink:href', svgPath);
                }

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

            scope.$on('$destroy', () => {
                element.remove();
            });

            scope.update();
        },

    };
};

import { shapesModule } from '../shapes.module';
import { retry } from 'async';
shapesModule.directive('stampShape', ['$log', 'stampModel', StampShape]);
