import * as _ from 'lodash';

class InactivityLogoutService {
    static $inject = ['authenticationService', 'currentUserModel', '$interval'];
    FIVE_SECONDS: number;
    ONE_MINUTE: number;
    beforeExpTimer: any;
    afterExpTimer: any;
    _currentUserModel: any;
    _authenticationService: any;
    $interval: any;
    lastMinuteTimerOn: boolean;
    lastActiveTimestamp: number;
    tokenDurationSecs: number;
    tokenDurationMillis: number;
    tokenDurationMins: number;

    constructor(authenticationService, currentUserModel, $interval) {
        // Service globals
        this.FIVE_SECONDS = 5000;
        this.ONE_MINUTE = 60000;
        this._currentUserModel = currentUserModel;
        this._authenticationService = authenticationService;
        this.$interval = $interval;
        this.lastMinuteTimerOn = false;
        this.lastActiveTimestamp = Date.now();

    }

    //  Pull, parse, & decode jwt. Determine number of minutes until expiration
    setTokenDuration() {
        if (this._currentUserModel && this._currentUserModel.jwt) {
            const jwtArray = this._currentUserModel.jwt.split('.');
            const jwtPayload = jwtArray[1];
            const jwtPayloadDecoded = JSON.parse(atob(jwtPayload));

            this.tokenDurationSecs = Math.max(jwtPayloadDecoded.exp - jwtPayloadDecoded.iat, 60);
            this.tokenDurationMillis = this.tokenDurationSecs * 1000;
            this.tokenDurationMins = Math.floor(this.tokenDurationSecs / 60);
        } else {
            this.tokenDurationSecs = 20000;
            this.tokenDurationMillis = this.tokenDurationSecs * 1000;
            this.tokenDurationMins = Math.floor(this.tokenDurationSecs / 60);
        }

    }

    // Listen on keyboard and mouse movements.
    // Update lastActive
    // If actuve in final minute before logout, immediately get new jwt
    setupActivityListeners() {
        const me = this;

        $(document).mousemove(_.throttle(() => {
            me.lastActiveTimestamp = Date.now();
            if (this.lastMinuteTimerOn) {
                this.lastMinuteTimerOn = false;
                me._authenticationService.authenticate(0).then(() => {
                    this.start();
                });
            }
        }, this.FIVE_SECONDS));

        $(document).keypress(_.throttle(() => {
            me.lastActiveTimestamp = Date.now();
            if (this.lastMinuteTimerOn) {
                this.lastMinuteTimerOn = false;
                me._authenticationService.authenticate(0).then(() => {
                    this.start();
                });
            }
        }, this.FIVE_SECONDS));
    }

    /// Before Expired ///
    stopBeforeExpTimer() {
        this.$interval.cancel(this.beforeExpTimer);
    }

    startBeforeExpTimer() {
        const me = this;

        this.stopBeforeExpTimer();

        this.beforeExpTimer = this.$interval(() => {
            const lastActiveMins = Math.floor(((Date.now() - me.lastActiveTimestamp) / 1000) / 60);

            if (lastActiveMins < this.tokenDurationMins - 1) {
                me._authenticationService.authenticate(lastActiveMins).then(() => {
                    this.start();
                });
            } else { // only 1 minute left
                this.lastMinuteTimerOn = true;
            }

        }, this.tokenDurationMillis - this.ONE_MINUTE);
    }

    /// After expired ///
    stopAfterExpTimer() {
        this.$interval.cancel(this.afterExpTimer);
    }

    startAfterExpTimer() {
        const me = this;

        this.stopAfterExpTimer();

        this.afterExpTimer = this.$interval(() => {
            const lastActiveMins = Math.floor(((Date.now() - me.lastActiveTimestamp) / 1000) / 60);

            me._authenticationService.authenticate(lastActiveMins); // should 401 and log user out
        }, this.tokenDurationMillis + this.FIVE_SECONDS);
    }

    // MAIN FUNCTION. Use inactivityLogoutService.start() to inject autologout into your app
    start() {
        // jh.04.24.2017 - temporarily disable auto logout
        // https://presencelearning.atlassian.net/browse/DEV-1977
       // return;
        this.setTokenDuration();

        this.setupActivityListeners();
        this.startBeforeExpTimer();
        this.startAfterExpTimer();
    }
}

import { commonModelsModule } from '../models.module';
commonModelsModule.service('inactivityLogoutService', InactivityLogoutService);

