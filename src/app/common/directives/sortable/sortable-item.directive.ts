let SortableItemDirective;

SortableItemDirective = function () {
    return {
        restrict: 'A',
        require: '^plSortable',
        link: ($scope, element, attr, controller) => {
            let itemNode = $(element);
            // Drag and drop handlers
            if (!controller) {
                return;
            }
            let dragStartHandler = controller.dragStart.bind(controller);
            let dragendHandler = controller.dragEnd.bind(controller);
            let dragoverHandler = controller.dragOver.bind(controller);

            function initEvents() {
                // Enable dragging
                itemNode.attr('draggable', 'true');
                element[0].addEventListener('dragstart', dragStartHandler);
                element[0].addEventListener('dragend', dragendHandler);
                element[0].addEventListener('dragover', dragoverHandler);
            }

            function removeEvents() {
                itemNode.attr('draggable', 'false');
                element[0].removeEventListener('dragstart', dragStartHandler);
                element[0].removeEventListener('dragend', dragendHandler);
                element[0].removeEventListener('dragover', dragoverHandler);
            }

            $scope.$watch( () => attr.plSortableItem, (value) => {
                initEvents();
                if ('false' === value) {
                    removeEvents();
                }
            });
            initEvents();

            let textArea = element.find('textarea');
            textArea
                .on('focus', function(e) {
                    element.attr("draggable", false);
                })
                .on('blur', function(e) {
                    element.attr("draggable", true);
                });
        }
    }
}

import { commonDirectivesModule } from '../common-directives.module';
commonDirectivesModule.directive('plSortableItem', [
    SortableItemDirective
]);
