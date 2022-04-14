let YoutubePlayerDirective;
YoutubePlayerDirective = function YoutubePlayerDirective(
    $log,
    $interval,
    firebaseAppModel,
    YouTubeFactory,
    activityModel,
    plAppGlobal,
    iPadService,
    currentUserModel,
    ngrxStoreService: Store<AppState>,
    conferenceService: ConferenceService,
) {
    return {
        restrict: 'E',
        template: require('./youtube-player.directive.html'),

        link: (scope, element) => {
            const subscriptions: Subscription[] = [];

            $log.debug('[YouTubeDirective] link!');
            const roomGlobal = plAppGlobal.getWindowGlobal();
            const body = angular.element('.workspace');
            activityModel.foundationLoaded.then(() => {
                initialize();
            });

            scope.isClinician = currentUserModel.user.isClinicianOrExternalProvider();

            subscriptions.push(
                ngrxStoreService.select(selectIPadGuestsWithYoutubeInteractionPending)
                .pipe(
                    map(students => students.map(s => s.displayName).join(', ')),
                    distinctUntilChanged(),
                ).subscribe((label) => {
                    scope.iPadStudentsPendingYoutubeInteraction = label;
                }),
            );

            scope.playerReady = false;
            scope.blockPlayButton = false;
            const playerContainer = element.find('.youtube-player');
            const whiteboardActiveInitialState = firebaseAppModel.app.whiteboardActive;
            const yt = new YouTubeFactory(element.find('.player')[0]);
            yt.on('playerReady', () => {
                if (whiteboardActiveInitialState) {
                    firebaseAppModel.setWhiteboardActive(false);
                }
                scope.playerReady = true;
                if (iPadService.isIPadStudent()) {
                    scope.isVideoBlocked = true;
                    setTimeout(() => {
                        setYoutubeInteractionPending(true);
                        setTimeout(() => {
                            $('.ipad-video-overlay').fadeIn();
                        }, 500);
                    }, 1);
                } else {
                    $('.player').show();
                }
            });
            yt.on('stateChange', (data) => {
                if (data.state === 'ended') {
                    yt.seek(0);
                    scope.play(false);
                }
            });

            function resizeVideo() {
                scope.playerWidth = playerContainer.width() - 30;
                scope.playerHeight = scope.playerWidth * 9 / 16;
                if (scope.playerHeight > playerContainer.height() - 74) {
                    scope.playerHeight = playerContainer.height() - 74;
                    scope.playerWidth = scope.playerHeight * 16 / 9;
                }
                scope.marginTop = scope.playerHeight / 2 + 22;
                scope.marginLeft = scope.playerWidth / 2;
            }

            let videoId = null;
            let updateTimeInterval = null;
            let saveTimeToFBInterval = null;
            function initialize() {
                scope.progressPercentage = 0;
                scope.muted = false;
                scope.playing = false;
                scope.currentSecond = 0;

                updateTimeInterval = $interval(updateTime, 100);
                saveTimeToFBInterval = $interval(saveTimeToFB, 1000);

                scope.$watch(() => body.width(), resizeVideo);
                scope.$watch(() => sessionStorage.getItem('activeDrawer'), resizeVideo);
                resizeVideo();
                yt.loadLibrary().then(() => {
                    setupReferences();
                    refs.videoId.set(activityModel.activity.config);
                });

                if (activityModel.channel) {
                    activityModel.channel.bind('play', () => {
                        scope.play('playing');
                    });
                }
            }

            scope.$on('$destroy', () => {
                if (iPadService.isIPadStudent()) {
                    setYoutubeInteractionPending(false);
                }
                if (whiteboardActiveInitialState) {
                    firebaseAppModel.setWhiteboardActive(true);
                }
                $(window).off('mousemove', onMoveScrubber);
                $(window).off('mouseup', onReleaseScrubber);
                $interval.cancel(updateTimeInterval);
                $interval.cancel(saveTimeToFBInterval);
                destroyReferences();
                subscriptions.forEach(s => s.unsubscribe());
            });

            let isDraggingScrubber = false;

            scope.jumpTo = function(evt) {
                const targetVideoTime = getScrubberPercentage(evt) / 100 * yt.getDuration();
                refs.time.set(targetVideoTime);
            };

            scope.onPressScrubber = function(evt) {
                $(window).on('mousemove', onMoveScrubber);
                $(window).on('mouseup', onReleaseScrubber);
                isDraggingScrubber = true;
                scope.progressPercentage = getScrubberPercentage(evt);
            };

            scope.play = function(state) {
                refs.state.child('playing').set(state);
                refs.time.set(yt.getCurrentTime());
            };
/*
//TODO: Fix the resolver and reinject currentUserModel before re-enabling this.
            $window.addEventListener('beforeunload', function() {
                if(currentUserModel.user.isClinician()) {
                    scope.play(false);
                    $log.debug('[YouTubeDirective] pausing video on clinician exit');
                }
            });
*/
            scope.mute = function(state) {
                refs.state.child('muted').set(state);
            };

            // This is ipad-student side.
            scope.activateYoutubeFromInteraction = function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                setYoutubeInteractionPending(false);
                $('.ipad-video-overlay').hide();
                $('.player').show();
                scope.isVideoBlocked = false;
                scope.blockPlayButton = true;
                // Local playback cannot be initiated remotely without a local user interaction.
                // The user interaction must be directly associated to the player by invoking playback
                // Also, we want the local result to end in a paused state to allow for the participants
                // to sync times and to give the provider a chance to control video playback.
                yt.play();
                setTimeout(() => {
                    scope.play(false);
                    yt.pause();
                    setTimeout(() => {
                        scope.blockPlayButton = false;
                    }, 500);
                }, 500);
            };

            function setYoutubeInteractionPending(isPending: boolean) {
                roomGlobal.showingYoutubeLootBox = isPending;
                ngrxStoreService.dispatch(
                    SessionActions.setYoutubeInteractionPending({
                        isPending,
                    }),
                );
            }

            const refs: any = {};
            function setupReferences() {
                const base = `activities/sessions/${activityModel.getSessionId()}/${activityModel.activity.configId}`;

                refs.videoId = activityModel.getRef(base + '/videoId');
                refs.videoId.on('value', handleVideoId, handleActivityError);

                refs.state = activityModel.getRef(base + '/state');
                refs.state.on('value', handleActivityData, handleActivityError);

                refs.time = activityModel.getRef(base + '/time');
                refs.time.on('value', handleTimeActivityData, handleActivityError);
            }

            function destroyReferences() {
                if (refs) {
                    if (refs.videoId) {
                        refs.videoId.off('value', handleVideoId);
                    }
                    if (refs.state) {
                        refs.state.off('value', handleActivityData);
                    }
                    if (refs.time) {
                        refs.time.off('value', handleTimeActivityData);
                    }
                }
            }

            function handleActivityError(error) {
                $log.debug('[YouTubeDirective] activity ref load error:' + error.code);
            }

            function handleVideoId(snap) {
                if (!scope.playerReady) {
                    return false;
                }
                videoId = snap.val();
                if (videoId) {
                    yt.cueVideo(videoId);
                } else {
                    $log.debug('No video id found.');
                }
            }

            function handleActivityData(snap) {
                if (!scope.playerReady) {
                    return false;
                }

                $log.debug('[YoutubeDirective] activity data loaded:' + snap.val());
                const sharedData = snap.val();

                if (!sharedData) {
                    return;
                }

                // existing shared data has priority over the defaults
                scope.playing = sharedData.playing !== undefined ? sharedData.playing : scope.playing;
                scope.muted = sharedData.muted !== undefined ? sharedData.muted : scope.muted;

                const state = yt.getState();
                if (scope.playing) {
                    yt.play();
                } else if (scope.playing === false && state !== 'videoQueued') {
                    // if the video is queued and you call pause, the video goes blank
                    yt.pause();
                }

                if (scope.muted) {
                    yt.mute(true);
                } else {
                    yt.mute(false);
                }
            }

            // PL-2146
            // YouTube on an iPad will stop (locally) when incoming conference streams startup, which
            // can leave the group of participants out of sync (some playing and some paused).
            // Work around this by deliberately pausing youtube for all participants to allow
            // the provider to resume in a controlled, synchronized manner.
            subscriptions.push(
                conferenceService.onJoined()
                    .pipe(
                        concatMap((ev) => {
                            return of(ev).pipe(
                                withLatestFrom(ngrxStoreService.select(selectIsLocalParticipantGuestIPad)),
                            );
                        }),
                        filter(([_, isIPadStudent]) => isIPadStudent && !scope.blockPlayButton && scope.playing),
                    )
                    .subscribe(() => {
                        scope.play(false);
                    }),
            );

            function timeDeltaInRange(serverTime, playerTime, range) {
                return Math.abs(serverTime - playerTime) < range;
            }

            const RANGE = 2;
            function handleTimeActivityData(snap) {
                if (!scope.playerReady || snap.val() === null) {
                    return false;
                }

                const timeFromServer = snap.val();
                if (typeof timeFromServer === 'undefined') {
                    return;
                }

                const playerTime = yt.getCurrentTime();

                if (timeDeltaInRange(timeFromServer, playerTime, RANGE)) {
                    return false;
                }

                scope.currentSecond = timeFromServer;

                // youtube api has a bug. When you seek to second x from second y, and immediately query
                // the currentsecond, it returns y, not x. Hack to fix is to start and then pause.
                if (!scope.playing) {
                    yt.play();
                }

                yt.seek(scope.currentSecond);

                if (!scope.playing) {
                    yt.pause();
                }
            }

            function saveTimeToFB() {
                if (!scope.playerReady) { return false; }
                if (scope.hasOwnProperty('timeRef')) {
                    refs.time.set(yt.getCurrentTime());
                }
            }

            function updateTime() {
                if (isDraggingScrubber) { return false; }
                if (!scope.playerReady) { return false; }

                let currentSeconds = 0;
                if (yt.getCurrentTime) {
                    currentSeconds = Math.round(yt.getCurrentTime());

                    const minute = Math.floor(currentSeconds / 60);
                    let seconds: any = currentSeconds % 60;
                    if (seconds < 10) {
                        seconds = '0' + seconds;
                    }

                    scope.currentTime = `${minute}:${seconds}`;

                    scope.progressPercentage = 100 * (currentSeconds / yt.getDuration());
                }

                setTotalTime();
            }

            function setTotalTime() {
                if (yt.getDuration) {
                    const durationSeconds = Math.round(yt.getDuration());

                    const minute = Math.floor(durationSeconds / 60);
                    let seconds: any = durationSeconds % 60;
                    if (seconds < 10) {
                        seconds = '0' + seconds;
                    }

                    scope.totalTime = `${minute}:${seconds}`;
                }
            }

            function onMoveScrubber(evt) {
                if (isDraggingScrubber) {
                    scope.progressPercentage = getScrubberPercentage(evt);
                    scope.$apply();
                }
            }
            function onReleaseScrubber(evt) {
                $(window).off('mousemove', onMoveScrubber);
                $(window).off('mouseup', onReleaseScrubber);
                if (isDraggingScrubber) {
                    scope.jumpTo(evt);
                    isDraggingScrubber = false;
                }
            }

            function getScrubberPercentage(evt) {
                const target = element.find('.track')[0];
                const rect = target.getBoundingClientRect();
                const relativeLeft = evt.pageX - rect.left;
                return Math.max(0, Math.min(100, relativeLeft / target.offsetWidth * 100));
            }
        },
    };
};

import * as angular from 'angular';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectIPadGuestsWithYoutubeInteractionPending, SessionActions, selectIsLocalParticipantGuestIPad } from '@room/session/store';
import { map, distinctUntilChanged, concatMap, withLatestFrom, filter } from 'rxjs/operators';
import { ConferenceService } from '@room/conference';
import { Subscription, of } from 'rxjs';

const youtubePlayer = angular.module('toys').directive('youtubePlayer', [
    '$log',
    '$interval',
    'firebaseAppModel',
    'YouTubeFactory',
    'activityModel',
    'plAppGlobal',
    'iPadSupportService',
    'currentUserModel',
    'ngrxStoreService',
    'conferenceService',
    YoutubePlayerDirective,
]);
