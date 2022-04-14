import { debounce, includes } from 'lodash';

let WjAudioDirective;
WjAudioDirective = function ($log, $q, $timeout, $sce, AssessmentModel, currentUserModel) {
    return {
        restrict: 'E',
        replace: true,
        template: require('./wj-audio.directive.html'),

        link: ($scope, element, attrs) => {

            // plugin for jquery to detect scrollbars
            (function($) {
                (<any>$.fn).hasScrollBar = function() {
                    return this.get(0).scrollHeight > this.height();
                };
            })(jQuery);

            const HEADER_HEIGHT = 40;

            $scope.showAudioControls = false;
            $scope.lastPlayPromise = null;

            AssessmentModel.foundationLoaded.then(init);

            $scope.$on('$destroy', () => {
                refs.state.update({ playing: false });
                refs.state.off('value', handleAudioState);
            });

            function init() {

                $log.debug('[WjAudioDirective init()');
                const descriptor = JSON.parse(AssessmentModel.configModel.model.descriptor);
                const audio = descriptor['audio'];
                const version = descriptor['version'];
                // setup permissions
                if (currentUserModel.user.isClinicianOrExternalProvider()) {
                    $scope.showAudioControls = true;

                    const w = angular.element('.workspace');

                    $scope.$watch(() => w.width(), debounce(() => {
                        $log.debug('[WjAudioDirective] resize');
                        // height
                        const newHeight = w.height() - HEADER_HEIGHT;
                        const audiocontrols = element.find('.audio-controls');
                        const audioelement = element.find('.audio-controls')[0];
                        audioelement.setAttribute('style', `height:${newHeight}px`);
                        // width
                        const hasVScroll = audiocontrols.hasScrollBar();
                        $log.debug('[WjAudioDirective] hasScroll:' + hasVScroll);
                        $scope.hasScroller = hasVScroll;

                    },                                        333));

                }

                // setup audio data to render the tracks
                if (version === 1 && audio != null && audio.length > 0) {
                    $scope.getProtectedAudio(audio).then((data) => {
                        $scope.audio = data;
                    });
                }

                $timeout(loadState);

            }

            $scope.audioControls = false;
            $scope.currentTrack = null;
            $scope.currentTime = 0;

            const refs: any = {};
            function loadState() {
                // get from firebase
                const base =
                    `activities/sessions/${AssessmentModel.getSessionId()}/${AssessmentModel.activity.configId}/audio`;

                refs.state = AssessmentModel.getRef(base + '/state');
                refs.state.on('value', handleAudioState, handleActivityError);
                setDisconnect();
            }

            function handleAudioState(snap) {
                const state = snap.val();
                if (state != null && state.trackId !== undefined) {
                    // check if we're playing a different track
                    if ($scope.currentId != null && $scope.currentId !== state.trackId) {
                        // pause the old one
                        const oldtrack = getAudioElement($scope.currentId);
                        if (oldtrack) {
                            $log.debug('[WjAudioDirective] pausing old element: ' + state.trackId);
                            oldtrack.pause();
                        }
                    }
                    // set the local state from the firebase data
                    $scope.currentTime = state.time;
                    $scope.currentId = state.trackId;
                    const audiotrack = getAudioElement(state.trackId);
                    if (audiotrack) {
                        $scope.tracktime = true;
                        watch(audiotrack);
                        // play if it's not already
                        if (state.playing && !isPlaying(audiotrack)) {
                            audiotrack.currentTime = $scope.currentTime;
                            $scope.lastPlayPromise = audiotrack.play();
                            $scope.lastPlayPromise.then(() => {
                                $scope.lastPlayPromise.done = true;
                            }).catch(error => {
                                $log.debug('play error ', error);
                            });
                            //
                        } else if (!state.playing) {
                            audiotrack.currentTime = $scope.currentTime;
                            $log.debug('[WjAudioDirective] firebase state event: pausing element: ' + state.trackId);
                            audiotrack.pause();
                        }
                    }
                }
            }

            function handleActivityError(error) {
                $log.debug('[WjAudioDirective] handleActivityError');
            }

            function setDisconnect() {
                if (currentUserModel.user.isClinicianOrExternalProvider() && refs.state.onDisconnect) {
                    refs.state.onDisconnect().cancel();
                    refs.state.onDisconnect().update({ playing: false });
                }
            }

            function getAudioElement(id) {
                const audiotrack = element.find('.audio-' + id)[0];
                return audiotrack;
            }

            function isPlaying(trackElement) {
                if (trackElement.duration > 0 && !trackElement.paused) {
                    return true;
                }
                return false;
            }

            // HTML AUDIO EVENT HANDLERS
            function handleTimeUpdate(event) {
                const audiotrack = getAudioElement($scope.currentId);
                $scope.currentTime = audiotrack.currentTime;
                const state = {
                    time: $scope.currentTime,
                };
                refs.state.update(state);
            }

            function handleEndTrack(id) {
                // this may cause problems if the tracks are not entirely synced
                $scope.pause($scope.currentId);
                const audiotrack = getAudioElement($scope.currentId);
                // this is not synced to the student playback
                if (audiotrack.currentTime !== audiotrack.duration) {
                    audiotrack.currentTime = audiotrack.duration;
                }
            }

            function handleSeeked(id) {
            }

            function handlePlaybackEvents(event) {
                // $log.debug("[Audio] playback: " + event.type);
                switch (event.type) {
                        case 'ended':
                            $log.debug('media: ended');
                            handleEndTrack($scope.currentId);
                            break;
                        case 'seeking':
                            $log.debug('media: seeking');
                            break;
                        case 'seeked':
                            $log.debug('media: seeked');
                            handleSeeked($scope.currentId);
                            break;
                        case 'play':
                            $log.debug('media: play');
                            break;
                        case 'pause':
                            $log.debug('media: pause');
                            break;
                }
            }

            function handleStartupEvents(event) {
                $log.debug('[Audio] media: ' + event.type);
            }

            function handleMediaErrorEvents(event) {
               // $log.debug("[Audio] media event: " + event.type);
                switch (event.type) {
                        case 'waiting':
                            $log.debug('media: waiting');
                            break;
                        case 'stalled':
                            $log.debug('media: stalled');
                            break;
                        case 'suspended':
                            $log.debug('media: suspended');
                            break;
                }
            }

            const watchedTracks = [];
            function watchAll(trackElement) {
                // $log.debug("[WjAudioDirective] watch: " + trackElement);
                // don't add listeners again
                if (!includes(watchedTracks, trackElement)) {
                    watchedTracks.push(trackElement);
                    trackElement.addEventListener('timeupdate', event => handleTimeUpdate(event));
                    trackElement.addEventListener('ended', event => handlePlaybackEvents(event));
                    trackElement.addEventListener('seeking', event => handlePlaybackEvents(event));
                    trackElement.addEventListener('seeked', event => handlePlaybackEvents(event));
                    trackElement.addEventListener('play', event => handlePlaybackEvents(event));
                    trackElement.addEventListener('pause', event => handlePlaybackEvents(event));
                    // startup
                    trackElement.addEventListener('canplaythrough', event => handleStartupEvents(event));
                    trackElement.addEventListener('canplay', event => handleStartupEvents(event));
                    // errors
                    trackElement.addEventListener('waiting', event => handleMediaErrorEvents(event));
                    trackElement.addEventListener('stalled', event => handleMediaErrorEvents(event));
                    trackElement.addEventListener('suspended', event => handleMediaErrorEvents(event));
                }
            }

            function watch(trackElement) {
                // $log.debug("[WjAudioDirective] watch: " + trackElement);
                // don't add listeners again
                if (!includes(watchedTracks, trackElement)) {
                    watchedTracks.push(trackElement);
                    trackElement.addEventListener('play', event => handlePlaybackEvents(event));
                    trackElement.addEventListener('pause', event => handlePlaybackEvents(event));
                    // startup
                    trackElement.addEventListener('canplaythrough', event => handleStartupEvents(event));
                    trackElement.addEventListener('canplay', event => handleStartupEvents(event));
                    // errors
                    trackElement.addEventListener('waiting', event => handleMediaErrorEvents(event));
                    trackElement.addEventListener('stalled', event => handleMediaErrorEvents(event));
                    trackElement.addEventListener('suspended', event => handleMediaErrorEvents(event));
                }
            }

            /**
             * Audio assessment mp3's must be protected so we pass each entry to the Model and get back a
             * protected temporary url e.g. protected_url which we can then stream for this session.
             * @param audio (array)
             * @returns promise
             */
            $scope.getProtectedAudio = function(audio) {
                $log.debug('[WjAudioDirective] getProtectedAudio');
                $scope.audioReady = $q.defer();
                for (let i = 0; i < audio.length; i++) {
                    const audiotrack = audio[i];
                    audiotrack.ready = false;
                    AssessmentModel.getProtectedContentUrl(audiotrack.src).then((data) => {
                        audiotrack.protected_url = data.assets[audiotrack.src];
                        audiotrack.ready = true;
                        if (isAudioResolved(audio)) {
                            $scope.audioReady.resolve(audio);
                        }
                    });
                }
                return $scope.audioReady.promise;
            };

            function isAudioResolved(audio) {
                if (audio.find(notReady)) {
                    return false;
                }
                return true;
            }

            function notReady(a) {
                return !a.ready;
            }

            $scope.play = function(id) {
                $log.debug('[WjAudioDirective] play: ' + id);
                if ($scope.currentId != null && $scope.currentId !== id) {
                    // clean up old track
                    const oldtrack = getAudioElement($scope.currentId);
                    if (oldtrack) {
                        $log.debug('[WjAudioDirective] pausing old element: ' + id);
                        oldtrack.pause();
                    }
                }
                const audiotrack = getAudioElement(id);
                watchAll(audiotrack);
                setDisconnect();
                let startFromTime = audiotrack.currentTime;
                if (audiotrack.currentTime >= audiotrack.duration) {
                    startFromTime = 0;
                }
                $log.debug('[WjAudioDirective] play from startFromTime: ' + startFromTime);
                const state = {
                    trackId: id,
                    playing: true,
                    time: startFromTime,
                };
                refs.state.update(state);
            };

            $scope.pause = function(id) {
                if ($scope.currentId === id) {
                    const audiotrack = getAudioElement(id);
                    setDisconnect();
                    const state = {
                        trackId: id,
                        playing: false,
                        time: audiotrack.currentTime,
                    };
                    refs.state.update(state);
                }
            };

            $scope.seek = function(id, value) {
                $log.debug('[audio] seek');
                const audiotrack = getAudioElement(id);
                if ($scope.currentId === id && isPlaying(audiotrack)) {
                    // if they did a seek on the currently playing track
                    // we should update the time in fb
                    setDisconnect();
                    const state = {
                        trackId: id,
                        playing: false,
                        time: value,
                    };
                    refs.state.update(state);
                } else {
                    audiotrack.currentTime = value;
                    const state = {
                        trackId: id,
                        playing: false,
                        time: value,
                    };
                    refs.state.update(state);
                }

            };

            $scope.collapsed = false;
            $scope.collapseToggle = function(collapse) {
                $log.debug('collapse audio player');
                $scope.collapsed = collapse;
            };

            $scope.getTrustedUrl = function(src) {
                return $sce.trustAsResourceUrl(src);
            };
        },
    };
};

import * as angular from 'angular';

const wjAudio = angular.module('toys').directive('wjAudio', [
    '$log', '$q', '$timeout', '$sce', 'AssessmentModel', 'currentUserModel',
    WjAudioDirective,
]);
