declare var YT: any;

const YouTubeFactory = function(
    $q,
    $window,
    EventDispatcher,
    iPadService,
) {

    const YouTube = function(playerDiv) {
        this._playerDiv = playerDiv;
        this._player = null;
        this._loaded = $q.defer();
        this.loaded = this._loaded.promise;
        this._state = null;
    };
    EventDispatcher.apply(YouTube);

    YouTube.prototype.loadLibrary = function() {
        // TODO:
        // we should makes sure it doesn't already exists before we add it
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        const libraryLoaded = $q.defer();
        $window.onYouTubeIframeAPIReady = () => {
            libraryLoaded.resolve();
        };

        if ((<any>window).YT) {
            libraryLoaded.resolve();
        }

        const onPlayerError = (error) => {
            console.warn('YouTube Player general error', error);
        };

        const onPlayerReady = (event) => {
            this.dispatchEvent({
                type : 'playerReady',
            });
            this._loaded.resolve();
        };

        const onStateChange = (event) => {
            let value = null;
            switch (event.data) {
                    case -1:
                        value = 'unstarted';
                        break;
                    case 0:
                        value = 'ended';
                        break;
                    case 1:
                        value = 'playing';
                        break;
                    case 2:
                        value = 'paused';
                        break;
                    case 3:
                        value = 'buffering';
                        break;
                    case 5:
                        value = 'videoQueued';
                        break;
                    default:
                        value = null;
            }
            this._state = value;
            this.dispatchEvent({
                type : 'stateChange',
                state : value,
            });
        };

        libraryLoaded.promise.then(
            () => {
                this._player = new YT.Player(this._playerDiv, {
                    events: {
                        onStateChange,
                        onReady: onPlayerReady,
                        onError: onPlayerError,
                    },
                    playerVars : {
                        enablejsapi : 1,
                        autohide : 1,
                        autoplay: 1,
                        playsinline: 1,
                        mute: 0,
                        html5: 1,
                        theme: 'light',
                        modestbranding: 1,
                        iv_load_policy: 3,
                        showinfo: 0,
                        controls: 0,
                        rel: 0,
                    },
                });
            },
            (error) => {
                console.warn('Error while loading YouTube player:', error);
            });

        return this.loaded;
    };

    YouTube.prototype.cueVideo = function(videoId) {
        this._player.cueVideoById({
            videoId,
        });
    };

    YouTube.prototype.getCurrentTime = function() {
        return this._player.getCurrentTime();
    };
    YouTube.prototype.getDuration = function() {
        return this._player.getDuration();
    };
    YouTube.prototype.mute = function(value) {
        if (value) {
            this._player.mute();
        } else {
            this._player.unMute();
        }
    };
    YouTube.prototype.isMuted = function() {
        return this._player.isMuted();
    };
    YouTube.prototype.play = function() {
        if (iPadService.isIPadStudent()) {
            setTimeout(() => {
                this._player.mute();
                this._player.playVideo();
                setTimeout(() => {
                    this._player.unMute();
                }, 1000);
            }, 200)

        } else {
            this._player.playVideo();
        }
    };
    YouTube.prototype.pause = function() {
        this._player.pauseVideo();
    };
    YouTube.prototype.seek = function(targetTime) {
        this._player.seekTo(targetTime);
    };
    YouTube.prototype.getState = function() {
        return this._state;
    };

    return YouTube;
};

import * as angular from 'angular';
import { Scope } from '@sentry/browser';

const youTubeFactory = angular.module('toys').service('YouTubeFactory', [
    '$q',
    '$window',
    'EventDispatcherFactory',
    'iPadSupportService',
    YouTubeFactory,
]);
