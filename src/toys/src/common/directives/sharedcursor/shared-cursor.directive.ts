import { debounce } from 'lodash';

const SharedCursorDirective = function(
    $log, $timeout, $compile, firebaseModel, guidService, localStorageService, AssessmentModel, firebaseAppModel, conferenceService,
    plFeatureFlagsService) {
    return {
        restrict: 'E',
        template: require('./shared-cursor.directive.html'),
        link: ($scope, $element, $attr) => {

            let lastClick = 0;
            const THREE_SECONDS = 3000;

            // TODO - it looks like these "magic" OFFSET constants may come from the size of a sonar ping. Rather than
            // applyn the offsets to the hand, maybe they should apply to the sonar ping placing instead.
            const MY_X_OFFSET = 50;
            const MY_Y_OFFSET = 6;
            let myguid;

            let fbTimeDelta = 0;
            let signalType = null;

            function addSonarLocal(snapshot) {
                if (snapshot.val()) {
                    const sonarData = snapshot.val();
                    // Not sure what this code was for, but removed as it blocks nearly all sonars.
                    // if (sonarData.lastclick !== lastClick && !isOld(sonarData.lastclick)) {
                    if (1) {
                        lastClick = sonarData.lastclick;
                        addSonar(sonarData);
                    }
                }
            }

            function addSonar(sonarData) {
                const parent = $element.parent();
                $timeout.cancel(timeoutPromise);
                hideCursor();

                const x = parent[0].clientWidth * sonarData.percentX;
                const y = parent[0].clientHeight * sonarData.percentY;

                const sonar = $compile('<sonar/>')($scope);
                sonar.offset({ left: x , top: y });
                $element.parent().append(sonar);
            }

            function loadState() {
                signalType = plFeatureFlagsService.getSharedCursorTokbox();
                if (signalType === 'firebase') {
                    // setup firebase refs
                    $scope.cursorRef = firebaseModel.getFirebaseRef(
                        // tslint:disable-next-line:max-line-length
                        `activities/sessions/cursor/${$element.attr('guid')}`,
                    );
                    $scope.cursorRef.on('value', handleCursorMove, handleCursorError);

                    if ($scope.sonarRef) {
                        $scope.sonarRef.off('value', addSonarLocal);
                    }
                    $scope.sonarRef = firebaseModel.getFirebaseRef(
                        // tslint:disable-next-line:max-line-length
                        `activities/sessions/sonar/${$element.attr('guid')}`,
                    );
                    $scope.sonarRef.on('value', addSonarLocal, handleCursorError);

                    $scope.deltaRef = firebaseModel.getFirebaseRef(
                        // tslint:disable-next-line:max-line-length
                        `activities/sessions/timedelta/`,
                    );
                    $scope.deltaRef.once('value', readFBServerTime, handleCursorError);
                    $scope.deltaRef.set({ time: firebase.database.ServerValue.TIMESTAMP });
                } else if (signalType === 'tokbox') {
                    conferenceService.onSignalEvent('sharedCursor').subscribe((evt) => {
                        const data = JSON.parse(evt.data);
                        if ($attr.guid === data.guid && data.guid !== myguid) {
                            updateCursor(data);
                        }
                    });
                    conferenceService.onSignalEvent('sharedCursorSonar').subscribe((evt) => {
                        const data = JSON.parse(evt.data);
                        addSonar(data);
                    });
                }
            }

            function readFBServerTime(snapshot) {
                fbTimeDelta = Date.now() - snapshot.val().time;
            }

            function handleCursorError(error) {
                $log.debug('Shared cursor error:' + error.code);
            }

            function useBigHand() {
                return (AssessmentModel.share && firebaseAppModel.app.activitiesActive);
            }

            function handleCursorMove(snapshot) {
                if (snapshot.val() && snapshot.key !== myguid) {
                    const cursorData = snapshot.val();
                    if (!isOld(cursorData.lastMoved)) {
                        updateCursor(cursorData);
                    }
                }
            }

            function updateCursor(cursorData) {
                const parent = $element.parent();
                if (parent[0]) {
                    const rect = parent.offset();
                    const xOffset = useBigHand() ? MY_X_OFFSET : 5;
                    const newX = cursorData.x * parent[0].clientWidth + rect.left - xOffset;
                    const newY = cursorData.y * parent[0].clientHeight + rect.top - MY_Y_OFFSET;

                    $element.show();

                    $element.offset({ top: newY, left: newX });

                    $timeout.cancel(timeoutPromise);
                    hideCursor();
                }
            }

            function isOld(lastMoved) {
                return Date.now() - fbTimeDelta - lastMoved > THREE_SECONDS;
            }

            let timeoutPromise;
            const hideCursor = debounce(() => {
                timeoutPromise = $timeout(() => {
                    $element.fadeOut();
                },                        3000);
            },                            1000);

            function initialize() {
                try {
                    myguid = localStorageService.get('user_guid');
                } catch (e) {
                    console.debug('error reading user_guid from localStorageService in SharedCursorDirective: ', e);
                }

                if (myguid === null || !myguid) {
                    myguid = guidService.generateUUID();
                    localStorageService.set('user_guid', myguid);
                }

                if ($attr.displayname && $attr.guid !== myguid) {
                    $element.append(`<div class="display-name"><div class="name">${$attr.displayname}</div></div>`);
                }

                plFeatureFlagsService.waitForReady(() => {
                    loadState();
                });
            }

            initialize();
        },
    };
};

import * as angular from 'angular';

const sharedCursor = angular.module('toys').directive('sharedCursor', [
    '$log', '$timeout', '$compile', 'firebaseModel', 'guidService', 'localStorageService', 'AssessmentModel', 'firebaseAppModel',
    'conferenceService', 'plFeatureFlagsService',
    SharedCursorDirective,
]);
