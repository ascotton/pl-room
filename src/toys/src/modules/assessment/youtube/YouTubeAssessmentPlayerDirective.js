


// **************************
// TODO: This is a direct copy and paste of the YouTubeController in the activities
// folder. Combind common parts and either subclass or use encapsulation to extend functionality as
// appropriate.
// *****************************
//
//
function YouTubeAssessmentPlayerDirective ($log, $interval, YouTube, AssessmentModel) {
    return {
        restrict: 'E',
        template: require('./youtubeassessmentplayer.tpl.html'),

        link: function(scope, element) {
            AssessmentModel.foundationLoaded.then(function() {
                init();
            });

            let DRAWER_WIDTH = AssessmentModel.share ? 0 : 192;
            scope.playerReady = false;
            var playerContainer = element.find('.youtube-player');

            var yt = new YouTube(element.find('.player')[0]);
            yt.on('playerReady', function() {
                scope.playerReady = true;
            });
            yt.on('stateChange', function(data) {
                if(data.state == 'ended') {
                    yt.seek(0);
                    scope.play(false);
                }
            });

            function resizeVideo () {
                scope.playerWidth = playerContainer.width() - 30 - DRAWER_WIDTH;
                scope.playerHeight = scope.playerWidth * 9 / 16;
                if (scope.playerHeight > playerContainer.height() - 74) {
                    scope.playerHeight = playerContainer.height() - 74;
                    scope.playerWidth = scope.playerHeight * 16 / 9;
                }
                scope.marginTop = scope.playerHeight/2+22;
                scope.marginLeft = scope.playerWidth/2 + DRAWER_WIDTH/2;
            }

            var videoId = null;
            function init() {

                scope.progressPercentage = 0;
                scope.muted = false;
                scope.playing = false;
                scope.currentSecond = 0;

                $interval(updateTime, 100);
                $interval(saveTimeToFB, 1000);

                var body = $('.workspace');

                $scope.$watch(() => body.width(), resizeVideo);
                $scope.$watch(() => sessionStorage.getItem('activeDrawer'), resizeVideo);

                resizeVideo();
                yt.loadLibrary().then(function() {
                    setupReferences();
                    refs.videoId.set(AssessmentModel.activity.config);
                });

                if (AssessmentModel.channel) {
                    AssessmentModel.channel.bind('play', function() {
                        scope.play('playing');
                    });
                }
            }


            var isDraggingScrubber = false;

            scope.jumpTo = function(evt){
                var targetVideoTime = getScrubberPercentage(evt) / 100 * yt.getDuration();
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
            };

            scope.mute = function(state) {
                refs.state.child('muted').set(state);
            };

            var refs = {};
            var setupReferences = function() {
                var base = 'activities/sessions/' + AssessmentModel.getSessionId() + '/' + AssessmentModel.activity.configId;

                refs.state = AssessmentModel.getRef(base + '/state');
                refs.state.on('value', handleActivityData, handleActivityError);

                refs.videoId = AssessmentModel.getRef(base + '/videoId');
                refs.videoId.on('value', handleVideoId, handleActivityError);

                refs.time = AssessmentModel.getRef(base + '/time');
                refs.time.on('value', handleTimeActivityData, handleActivityError);
            };

            function handleActivityError(error) {
                $log.debug('[YouTubeAssessmentDirective] activity ref load error:' + error.code);
            }

            var handleVideoId = function(snap) {
                if(!scope.playerReady) {
                    return false;
                }
                videoId = snap.val();
                if (videoId) {
                    yt.cueVideo(videoId);
                } else {
                    $log.debug('No video id found.');
                }
            };

            var handleActivityData = function(snap){
                if(!scope.playerReady) {
                    return false;
                }

                $log.debug('[YouTubeAssessmentDirective] activity data loaded:' + snap.val());
                var sharedData = snap.val();

                if(!sharedData){
                    return;
                }

                //existing shared data has priority over the defaults
                scope.playing = sharedData.playing != undefined ? sharedData.playing : scope.playing;
                scope.muted = sharedData.muted != undefined ? sharedData.muted : scope.muted;

                var state = yt.getState();
                if(sharedData.playing) {
                    yt.play();
                } else if(sharedData.playing == false && state != 'videoQueued') {
                    // if the video is queued and you call pause, the video goes blank
                    yt.pause();
                }

                if(sharedData.muted) {
                    yt.mute(true);
                    scope.muted = true;
                }else{
                    yt.mute(false);
                    scope.muted = false;
                }
            };

            var timeDeltaInRange = function(serverTime, playerTime, range){
                return Math.abs(serverTime - playerTime) < range;
            };

            var RANGE = 2;
            var handleTimeActivityData = function(snap) {
                if(!scope.playerReady || snap.val() === null) {
                    return false;
                }

                var timeFromServer = snap.val();
                if (typeof timeFromServer === 'undefined') {
                    return;
                }
                
                var playerTime = yt.getCurrentTime();

                if(timeDeltaInRange(timeFromServer, playerTime, RANGE )){
                    return false;
                }

                scope.currentSecond = timeFromServer;

                //youtube api has a bug. When you seek to second x from second y, and immediately query
                // the currentsecond, it returns y, not x. Hack to fix is to start and then pause.
                if(!scope.playing){
                    yt.play();
                }

                yt.seek(scope.currentSecond);

                if(!scope.playing){
                    yt.pause();
                }
            };

            function saveTimeToFB () {
                if(!scope.playerReady){ return false; }
                if (scope.hasOwnProperty('timeRef')) {
                    refs.time.set(yt.getCurrentTime());
                }
            }

            function updateTime () {
                if (isDraggingScrubber) { return false; }
                if (!scope.playerReady) { return false; }

                var currentSeconds = 0;
                if(yt.getCurrentTime) {
                    currentSeconds = Math.round(yt.getCurrentTime());

                    var minute = Math.floor(currentSeconds / 60);
                    var seconds = currentSeconds % 60;
                    if (seconds < 10) {
                        seconds = '0' + seconds;
                    }

                    scope.currentTime = minute + ':' + seconds;

                    scope.progressPercentage = 100 * (currentSeconds / yt.getDuration());
                }

                setTotalTime();
            }

            function setTotalTime () {
                if(yt.getDuration) {
                    var durationSeconds = Math.round(yt.getDuration());

                    var minute = Math.floor(durationSeconds / 60);
                    var seconds = durationSeconds % 60;
                    if (seconds < 10){
                        seconds = '0' + seconds;
                    }

                    scope.totalTime = minute + ':' + seconds;
                }
            }

            var onMoveScrubber = function(evt) {
                if (isDraggingScrubber) {
                    scope.progressPercentage = getScrubberPercentage(evt);
                    scope.$apply();
                }
            };
            var onReleaseScrubber = function(evt) {
                $(window).off('mousemove', onMoveScrubber);
                $(window).off('mouseup', onReleaseScrubber);
                if (isDraggingScrubber) {
                    scope.jumpTo(evt);
                    isDraggingScrubber = false;
                }
            };

            function getScrubberPercentage (evt) {
                var target = element.find('.track')[0],
                    rect = target.getBoundingClientRect(),
                    relativeLeft = evt.pageX - rect.left;
                return Math.max(0, Math.min(100, relativeLeft / target.offsetWidth * 100));
            }
        }
    };
}

YouTubeAssessmentPlayerDirective.$inject = ['$log', '$interval', 'YouTube', 'AssessmentModel'];
module.exports = YouTubeAssessmentPlayerDirective;

