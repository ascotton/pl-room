import { debounce, throttle } from 'lodash';

const SharedCursorPanelDirective = function (
    $log, $compile, $timeout, firebaseModel, guidService, localStorageService, currentUserModel,
    AssessmentModel, appModel, firebaseAppModel, plFeatureFlagsService, iPadService, conferenceService) {
    return {
        restrict: 'AE',
        link: ($scope, $element, $attr) => {

            // One per guid, to avoid duplicates.
            const cursorsAdded = {};
            let mySharedCursor;
            let displayName = currentUserModel.user.getFirstNameLastInitial();

            // TODO - it looks like these "magic" constants may come from the size of a sonar ping. Rather than apply
            // the offsets to the hand, maybe they should apply to the sonar ping placing instead.
            const MY_X_OFFSET = 50;
            const MY_Y_OFFSET = 6;
            const falseValue = 'false';

            let myguid;
            let isHideCursor = true;

            let signalType = null;

            $element.on('click', addSonar);
            $element.on('touchstart', addSonar);
            $element.on('mousemove', moveMySharedCursor);
            $element.on('touchmove', moveMySharedCursor);
            $scope.$watch(() => $attr.sharedCursorPanel, (newValue) => {
                isHideCursor = newValue === falseValue;
                if (isHideCursor) {
                    if (mySharedCursor) {
                        $(mySharedCursor[0]).fadeOut();
                    }
                    return;
                }
                initialize();
            });

            function useBigHand() {
                return (AssessmentModel.share && firebaseAppModel.app.activitiesActive);
            }

            function addSonar(event) {
                if (isHideCursor) {
                    return;
                }

                if (mySharedCursor === undefined) {
                    createCursor();
                }
                $timeout.cancel(timeoutPromise);

                const rect = $element.get(0).getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                if (useBigHand()) {
                    const percentX = x / $element[0].clientWidth;
                    const percentY = y / $element[0].clientHeight;
                    // sonar gets called a lot so let's do a sanity check to make sure the values don't break firebase.
                    if (isNaN(percentX) || isNaN(percentY)) {
                        $log.debug('Error: calculated percent values are NaN');
                        return;
                    }
                    const sonarData: any = { guid: myguid, percentX, percentY };
                    if (signalType === 'firebase') {
                        sonarData.lastClick = firebase.database.ServerValue.TIMESTAMP;
                        $scope.sonarRef.update(sonarData);
                    } else if (signalType === 'tokbox') {
                        conferenceService.signal(JSON.stringify(sonarData), 'sharedCursorSonar').subscribe();
                    }
                } else {
                    $log.debug('not sharing sonar');
                }
            }

            function createCursor() {
                $scope.myCursorRef = firebaseModel.getFirebaseRef(
                        // tslint:disable-next-line:max-line-length
                        `activities/sessions/cursor/${myguid}`,
                    );
                $scope.myCursorRef.onDisconnect().remove();
                if (signalType === 'firebase') {
                    $scope.sonarRef = firebaseModel.getFirebaseRef(
                        // tslint:disable-next-line:max-line-length
                        `activities/sessions/sonar/${myguid}`,
                    );
                    $scope.sonarRef.onDisconnect().remove();
                }

                cursorsAdded[myguid] = true;
                mySharedCursor = $compile(`<shared-cursor guid=${myguid} displayname='${displayName}'/>`)($scope);
                $element.append(mySharedCursor);
            }

            function moveMySharedCursor(e) {
                if (isHideCursor) {
                    return;
                }

                let pageX = e.pageX;
                let pageY = e.pageY;
                if (iPadService.isTouchEvent(e)) {
                    pageX = iPadService.getClientXFromTouchEvent(e);
                    pageY = iPadService.getClientYFromTouchEvent(e);
                }

                if (mySharedCursor === undefined) {
                    createCursor();
                }
                const showSelf = useBigHand() ? 1 : 0;
                if (!showSelf) {
                    $(mySharedCursor[0]).fadeOut();
                } else {
                    $(mySharedCursor[0]).show();

                    // Different cursor sizes require different offsets.
                    const xOffset = useBigHand() ? MY_X_OFFSET : 5;
                    const x = pageX - xOffset;
                    const y = pageY - MY_Y_OFFSET;

                    // Assessment audio controls are in the workspace but it's been requested that the shared cursor
                    // not be rendered there, so we need to treat the controls as being the right edge of the workspace
                    // when they are present.
                    // TODO - seems expensive to test for this every time. Consider extending AssessementModel so that it
                    // knows when we are in audio mode and need to test for the holder.
                    const audioHolder = $('.audio-holder');
                    if (audioHolder.length > 0) {
                        const offset = audioHolder.offset();
                        if (x > offset.left - xOffset) {
                            return;
                        }
                    }
                    $(mySharedCursor[0]).offset({ top: y, left: x });

                    $timeout.cancel(timeoutPromise);
                    hideCursor();
                }

                const rect = $element.offset();
                const x2 = pageX - rect.left;
                const y2 = pageY - rect.top;
                const scaledX = x2 / $element[0].clientWidth;
                const scaledY = y2 / $element[0].clientHeight;
                sendCursorToFB(scaledX, scaledY);
            }

            let timeoutPromise;
            const hideCursor = debounce(
                () => {
                    timeoutPromise = $timeout(
                        () => {
                            if (mySharedCursor) {
                                $(mySharedCursor[0]).fadeOut();
                            }
                        },
                        3000);
                },
                1000);

            const sendCursorToFB = throttle((newX, newY) => {
                const data = {
                    x: newX,
                    y: newY,
                    lastMoved: firebase.database.ServerValue.TIMESTAMP,
                    displayName: displayName || '',
                    guid: myguid,
                };
                if (signalType === 'firebase') {
                    $scope.myCursorRef.update(data);
                } else if (signalType === 'tokbox') {
                    conferenceService.signal(JSON.stringify(data), 'sharedCursor').subscribe();
                }
            }, 200, {
                leading: true,
            });

            function loadState() {
                let retries = 0;
                let loaded = false;

                const tryLoad = () => {
                    signalType = plFeatureFlagsService.getSharedCursorTokbox();
                    retries++;
                    // if (AssessmentModel.getSessionId()) {
                    if (1) {
                        const cursorPath =
                            // tslint:disable-next-line:max-line-length
                            `activities/sessions/cursor`;
                        $scope.cursorsRef = firebaseModel.getFirebaseRef(cursorPath);
                        $scope.cursorsRef.on('child_added', addCursorRef, handleCursorError);
                        loaded = true;
                    } else if (retries < 10) {
                        $timeout(tryLoad, 100);
                    }
                };
                tryLoad();

                if (signalType === 'tokbox') {
                    // Listen for adding new cursor elements.
                    conferenceService.onSignalEvent('sharedCursor').subscribe((evt) => {
                        addCursor(JSON.parse(evt.data));
                    });
                }

            }

            function addCursorRef(snapshot) {
                if (snapshot.val()) {
                    const data = snapshot.val();
                    addCursor(data);
                }
            }

            function addCursor(data) {
                if (data.guid && !cursorsAdded[data.guid]) {
                    cursorsAdded[data.guid] = true;
                    const displayName1 = data.displayName;
                    const sharedCursor = $compile(`<shared-cursor guid=${data.guid} displayname='${displayName1}'></shared-cursor>`)($scope);
                    $element.append(sharedCursor);
                    sharedCursor.hide();
                }
            }

            function handleCursorError(error) {
                $log.debug('Shared cursor error:' + error.code);
            }

            function initialize() {
                try {
                    myguid = localStorageService.get('user_guid');
                } catch (e) {
                    console.debug('error reading user_guid from localStorageService in SharedCursorPanelDirective: ', e);
                }

                if (myguid === null || !myguid) {
                    myguid = guidService.generateUUID();
                    localStorageService.set('user_guid', myguid);
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

const sharedCursorPanel = angular.module('toys').directive('sharedCursorPanel', [
    '$log', '$compile', '$timeout', 'firebaseModel', 'guidService', 'localStorageService',
    'currentUserModel', 'AssessmentModel', 'appModel', 'firebaseAppModel',
    'plFeatureFlagsService', 'iPadSupportService', 'conferenceService',
    SharedCursorPanelDirective,
]);
