import * as moment from 'moment';

let AudioPlayerDirective;
AudioPlayerDirective = function ($log, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: '=',
        template: require('./audio-player.directive.html'),

        link: ($scope, element, attrs) => {

            $scope.duration = '0:00';
            $scope.current = '0:00';
            $scope.playing = false;
            $scope.rangevalue = 0;

            $scope.$watch('audiotrack', (newVal, oldVal) => {
                $scope.audiotrack = newVal;
                $scope.audioElement = element.find('.audio-' + newVal.id)[0];
                $scope.audioElement.addEventListener('durationchange', event => handleDurationChange(event));
                $scope.audioElement.addEventListener('pause', event => handlePause(event));
                $scope.current = formatTime($scope.audioElement.currentTime);
            });

            function handleDurationChange(evt) {
                $log.debug('[AudioPlayerDirective] handleDurationChange');
                $scope.duration = formatTime($scope.audioElement.duration);
                setupSeekbar();
                $scope.audioElement.addEventListener('timeupdate', event => handleTimeupdate(event));
            }

            function handlePause(event) {
                $scope.playing = false;
            }

            function handleTimeupdate(event) {
                $scope.current = formatTime($scope.audioElement.currentTime);
                $scope.seekbar.value =  $scope.audioElement.currentTime;
                setupSeekbar();
                $scope.$digest();
            }

            $scope.playing = false;
            $scope.playbackToggle = function(playing, id) {
                $scope.playing = playing;
                if (playing === true) {
                    $scope.play(id);
                } else {
                    $scope.pause(id);
                }
                $timeout(() => {
                });
            };

            $scope.seekControlChange = function(id, value) {
                $scope.playing = false;
                $scope.seek(id, $scope.seekbar.value);
            };

            function setupSeekbar() {
                $scope.seekbar = element.find('.seekbar-' + $scope.audiotrack.id)[0];
                $scope.seekbar.max = $scope.audioElement.duration;
                $scope.seekbar.min = 0;
                $scope.seekbar.value = $scope.audioElement.currentTime;
                $scope.rangevalue = $scope.audioElement.currentTime;
            }

            function formatTime(seconds) {
                const time = moment().startOf('day')
                                   .seconds(seconds)
                                   .format('mm:ss');
                return time;
            }

        },
    };
};

import * as angular from 'angular';

const audioPlayer = angular.module('toys').directive('audioplayer', [
    '$log', '$timeout',
    AudioPlayerDirective,
]);
