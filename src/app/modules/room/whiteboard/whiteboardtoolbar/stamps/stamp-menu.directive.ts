let StampMenuDirective;

StampMenuDirective = function StampMenuDirective($log, $timeout, whiteboardModel, stampModel, stampTool) {
    return {
        restrict: 'E',
        template: require('./stamp-menu.directive.html'),
        scope: {
            stampType: '@stampType',
            menuLabel: '@menuLabel',
            buttonStampId: '@buttonStampId',
            buttonSkintone: '@buttonSkintone',
        },
        transclude: true,
        link: function stampMenuLink(scope) {
            scope.stamps = stampModel.getStamps(scope.stampType);
            if (!scope.menuLabel) {
                scope.menuLabel = scope.stampType;
            }
            scope.isSkinToneType = stampModel.isSkinToneType(scope.stampType);

            const updateButtonStamp = () => {
                    if (scope.buttonSkintone) {
                        let searchId = scope.buttonStampId.toLowerCase();
                        if (scope.buttonSkintone!== 'none' && scope.buttonSkintone !== 'default') searchId += '-' + scope.buttonSkintone.toLowerCase();
                        scope.buttonStamp = scope.stamps.find(stamp => {
                            try {
                                return stamp.id.toLowerCase() === searchId;
                            } catch (e) {
                                console.log('error updateButtonStamp: ', e);
                                console.log('error stamp: ', stamp);
                            }
                        });
                    } else {
                        scope.buttonStamp = scope.stamps.find(stamp => stamp.id.toLowerCase() === scope.buttonStampId.toLowerCase());
                    }
            };
            updateButtonStamp();

            scope.selectStamp = (stamp) => {
                const stampData = {
                    png: stamp.png,
                    svg: stamp.svg,
                    id: stamp.id,
                };
                // TODO - update currently selected stamp when skintone is changed.
                whiteboardModel.setToolbarProperty('stamp', stampData, true);
                whiteboardModel.setContentCursor(stampTool.cursor);
            };

            if (scope.isSkinToneType) {
                scope.$watch(() => stampModel.getCurrentSkinToneID(), (newVal) => {
                    scope.stamps = stampModel.getStamps(scope.stampType);
                    scope.buttonSkintone = newVal;
                    updateButtonStamp();
                });
            }
        },
    };
};

import { whiteboardToolbarModule } from '../whiteboard-toolbar.module';

const stampMenuDirective = whiteboardToolbarModule.directive(
    'stampMenu',
    ['$log', '$timeout', 'whiteboardModel', 'stampModel', 'stampTool', StampMenuDirective]);
