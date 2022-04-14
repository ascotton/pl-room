import { throttle } from 'lodash';

var SharedCursorPanelDirective = function ($log, $compile, $timeout, firebaseModel, guidService, localStorageService, AssessmentModel) {
    return {
        restrict: 'AE',
        link: function ($scope, $element, $attr) {

            let myDisplayName = 'guest';
            let mySessionGuid;

            $element.on('mousemove', moveMySharedCursor);
            let sharedPanel = $('body')[0];

            function moveMySharedCursor(e) {
                if ($scope.myCursorRef === undefined) {
                    return;
                }

                let x = e.pageX;
                let y = e.pageY;
                let scaledX;
                let scaledY;

                scaledX = x / sharedPanel.clientWidth;
                scaledY = y / sharedPanel.clientHeight;

                sendCursorToFB(scaledX, scaledY);
            }

            var sendCursorToFB = throttle(function (newX, newY) {
                $scope.myCursorRef.update({
                    x: newX,
                    y: newY,
                    lastMoved: firebase.database.ServerValue.TIMESTAMP,
                    displayName: myDisplayName || ''
                });
            }, 100, {
                leading: true
            });

            function loadState() {
                if (AssessmentModel.share) {
                    $scope.myCursorRef = firebaseModel.getFirebaseRef('activities/sessions/cursor/' + mySessionGuid);
                }
            }

            function initialize() {
                myDisplayName = $scope.$parent.username;
                mySessionGuid = $scope.$parent.userSessionGuid;
                loadState();
            }
            initialize();
        }
    };
};

SharedCursorPanelDirective.$inject = ['$log', '$compile', '$timeout', 'firebaseModel', 'guidService', 'localStorageService', 'AssessmentModel'];
module.exports = SharedCursorPanelDirective;
