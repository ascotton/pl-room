import { isUndefined } from 'lodash';

const SortableDirective = function() {
    return {
        restrict: 'A',
        controller: 'sortableController',
        scope: {
            sortableHideSourceNode: '=',
            sortableStrictMode: '=',
            sortableType: '=',
            sortableList: '=',
            callback: '&sortableOnSort',
            dropCallback: '&sortableOnDrop',
            workspaceDropCallback: '&sortableOnWorkspaceDrop',
            sortableInsertPointerTag: '@',
            sortableInsertPointerClass: '@',
            sortableInsertPointerPosition: '@'
        },
        link: ($scope, element, attr, controller) => {
            $scope.canceled = attr.sortableOnCanceled;
            $scope.shouldUseAngular = attr.sortableShouldUseAngular;

            controller.container = $(element[0]).css('position', 'relative');
            controller.type = (attr.sortableType === 'vertical') ? 'vertical' : 'horizontal';
            controller.hideSourceNode = attr.sortableHideSourceNode === 'false' ? false : true;
            controller.insertPointerPosition = attr.sortableInsertPointerPosition === 'false' ? false : true;
            controller.strictMode = attr.sortableStrictMode === true;
            controller.sortableInjectNodeTag = isUndefined(attr.sortableInsertPointerTag) ? 'div' : attr.sortableInsertPointerTag;
            controller.sortableInjectNodeClass = isUndefined(attr.sortableInsertPointerClass) ? 'separator' : attr.sortableInsertPointerClass;
            controller.scope = $scope;

            if ($scope.canceled) {
                element[0].addEventListener('dragenter', controller.bodyDragEnter);
                element[0].addEventListener('dragover', (e) => e.preventDefault());
            }
            element[0].addEventListener('drop', controller.bodyDragDrop.bind(controller), true);
            // Additional padding for insert pointer
            if (attr.sortableType === 'horizontal') {
                controller.container.css({'padding-bottom': '2px'});
            } else {
                controller.container.css({'padding-right': '2px', 'padding-left': '2px'});
            }
        }
    }
}

import { commonDirectivesModule } from '../common-directives.module';
commonDirectivesModule.directive('plSortable',SortableDirective);
