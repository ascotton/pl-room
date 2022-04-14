import { Injectable } from '@angular/core';
import { PLLodashService } from '@root/index';
import { CurrentUserService } from './current-user.service';
import { PLJWTDecoder } from '@root/index';

@Injectable()
export class InactivityLogoutService {
    FIVE_SECONDS = 5000;
    ONE_MINUTE = 60000;
    beforeExpTimer: any;
    afterExpTimer: any;
    currentUserModel: any;
    lastMinuteTimerOn = false;
    lastActiveTimestamp: any;

    tokenDurationSecs: number;
    tokenDurationMillis: number;
    tokenDurationMins: number;

    mouseListener: any;
    keyPressListener: any;

    // NOTE - renderer must be set by an external component, and is an instance of Renderer2.
    // Only components can inject Renderer2. Currently, it is being set by app.component.ts
    renderer: any;

    constructor(private lodash: PLLodashService,
                private currentUserService: CurrentUserService) {
        this.lastActiveTimestamp = Date.now();
    }

    //  Pull, parse, & decode jwt. Determine number of minutes until expiration
    setTokenDuration() {
        const jwtPayloadDecoded = new PLJWTDecoder(this.currentUserService.jwt);

        this.tokenDurationSecs = Math.max(jwtPayloadDecoded.expirationTime - jwtPayloadDecoded.issuedAtTime, 60);
        this.tokenDurationMillis = this.tokenDurationSecs * 1000;
        this.tokenDurationMins = Math.floor(this.tokenDurationSecs / 60);

        // TESTING NOTES - uncomment the two lines below for functional testing, sets a 2 minute expiration
        // rather than 24 hours.
        // this.tokenDurationMins = 2;
        // this.tokenDurationMillis = this.tokenDurationMins * 60 * 1000;
    }

    private reset = this.lodash.throttle(
        () => {
            this.lastActiveTimestamp = Date.now();
            if (this.lastMinuteTimerOn) {
                this.lastMinuteTimerOn = false;
                this.currentUserService.checkAndLogin(0).subscribe(() => {
                    this.start();
                });
            }
        },
        this.FIVE_SECONDS,
    );

    // Listen on keyboard and mouse movements.
    // Update lastActive
    // If active in final minute before logout, immediately get new jwt
    setupActivityListeners() {
        if (!this.mouseListener)  {
            this.mouseListener = this.renderer.listen('document', 'mousemove', this.reset);
        }
        if (!this.keyPressListener)  {
            this.keyPressListener = this.renderer.listen('document', 'keypress', this.reset);
        }
    }

    /// Before Expired ///
    stopBeforeExpTimer() {
        clearInterval(this.beforeExpTimer);
    }

    startBeforeExpTimer() {
        this.stopBeforeExpTimer();

        this.beforeExpTimer = setInterval(
            () => {
                const lastActiveMins = Math.floor(((Date.now() - this.lastActiveTimestamp) / 1000) / 60);

                if (lastActiveMins < this.tokenDurationMins - 1) {
                    this.currentUserService.checkAndLogin(lastActiveMins).subscribe(() => {
                        this.start();
                    });
                } else { // only 1 minute left
                    this.lastMinuteTimerOn = true;
                }

            },
            this.tokenDurationMillis - this.ONE_MINUTE,
        );
    }

    /// After expired ///
    stopAfterExpTimer() {
        clearInterval(this.afterExpTimer);
    }

    startAfterExpTimer() {
        this.stopAfterExpTimer();
        this.afterExpTimer = setInterval(
            () => {
                this.currentUserService.logout();
            },
            this.tokenDurationMillis + this.FIVE_SECONDS,
        );
    }

    // MAIN FUNCTION. Use inactivityLogoutService.start() to inject autologout into your app
    start() {
        this.setTokenDuration();
        this.setupActivityListeners();
        this.startBeforeExpTimer();
        this.startAfterExpTimer();
    }
}
