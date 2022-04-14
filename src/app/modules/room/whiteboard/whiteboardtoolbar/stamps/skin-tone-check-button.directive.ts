let skinToneCheckButtonDirective;
skinToneCheckButtonDirective = function SkinToneCheckButtonDirective($log, stampModel) {
    return {
        restrict: 'E',
        template: require('./skin-tone-check-button.directive.html'),
        scope: {
            skinToneId: '@skinToneId',
        },
        transclude: true,

        link: function skinToneCheckButtonDirectiveLink(scope, element) {
            scope.skinTone = stampModel.getSkinTone(scope.skinToneId);
            scope.isSelected = false;
            scope.isHovering = false;

            scope.selectSkintone = (e) => {
                stampModel.setSkinTone(scope.skinToneId);
            };

            $(element).on('mouseup', (e) => {
                e.stopPropagation();
            });

            scope.$watch(() => stampModel.getCurrentSkinToneID(), (newVal) => {
                scope.isSelected = newVal && scope.skinToneId === newVal;
            });
        },
    };
};

import { whiteboardToolbarModule } from '../whiteboard-toolbar.module';

const skinToneCheckButton = whiteboardToolbarModule.directive(
    'skinToneCheckButton',
    ['$log', 'stampModel', skinToneCheckButtonDirective]);
