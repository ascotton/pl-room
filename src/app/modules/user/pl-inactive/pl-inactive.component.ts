import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { AppStore } from '@app/appstore.model';

import { environment } from '@root/src/environments/environment'

import { PLConfirmDialogService, PLUrlsService, PLWindowService } from '@root/index';

import { PLRoomCleanupService } from './pl-room-cleanup.service';
import { PLInactiveService } from './pl-inactive.service';
import { selectCurrentUser } from '../store';
import { AppState } from '@app/store';
import { User } from '../user.model';
import { Subscription } from 'rxjs';
import { CurrentUserService } from '../current-user.service';

@Component({
    selector: 'pl-inactive',
    templateUrl: './pl-inactive.component.html',
    styleUrls: ['./pl-inactive.component.less'],
})
export class PLInactiveComponent implements OnInit, OnDestroy {
    subscription: Subscription;

    currentUser: User;

    maxInactiveSeconds: number = environment.room.inactiveSeconds || 60 * 60;        // 60 minutes
    timeoutTrigger: any = null;
    intervalTrigger: any = null;
    confirmSeconds = 60;

    @HostListener('document:mousemove', ['$event']) onMouseMove(e) {
        this.checkInactive();
    }
    @HostListener('document:keydown', ['$event']) onKeyDown(e) {
        this.checkInactive();
    }

    constructor(private plConfirmService: PLConfirmDialogService,
                private plUrls: PLUrlsService,
                private plRoomCleanup: PLRoomCleanupService,
                private plWindow: PLWindowService,
                private currentUserService: CurrentUserService,
                private plInactive: PLInactiveService,
                store: Store<AppState>) {

        this.subscription = store.select(selectCurrentUser).subscribe(
            (user) => {
                this.currentUser = user;
            });
    }

    ngOnInit() {
        this.plInactive.clearLastActiveDatetime();
        this.checkInactive();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    checkInactive() {
        const ret = this.plInactive.checkInactiveByDatetime();
        if (ret.reset) {
            this.resetTimer();
        } else {
            // Immediately close; could already be far too long so do not want to allow user to keep it open.
            this.closeRoom();
        }
    }

    closeRoom() {
        this.clearInactive();
        this.clearInterval();
        this.plInactive.clearLastActiveDatetime();
        this.plRoomCleanup.cleanup(this.currentUserService.isStudentLogin);
        // Should use a callback to do this after cleanup is done, but since that goes into ng1 land, we will
        // just use a timeout.
        setTimeout(() => {
            // For students, just logout is sufficient. For providers, keep them logged in and redirect.
            if (!this.currentUserService.isStudentLogin) {
                if (this.currentUser.groups.indexOf('School Staff Providers') >= 0 ||
                    this.currentUser.groups.indexOf('Private Practice') >= 0) {
                    this.plWindow.location.href = this.plUrls.urls.libraryFE;
                } else {
                    this.plWindow.location.href = this.plUrls.urls.landingFE;
                }
            }
        },         1000);
    }

    clearInactive() {
        if (this.timeoutTrigger) {
            clearTimeout(this.timeoutTrigger);
        }
    }

    clearInterval() {
        if (this.intervalTrigger) {
            clearInterval(this.intervalTrigger);
        }
    }

    resetTimer() {
        this.plInactive.setLastActiveDatetime(moment());
        this.clearInactive();
        this.timeoutTrigger = setTimeout(() => {
            this.showConfirm();
        },                               this.maxInactiveSeconds * 1000);
    }

    showConfirm() {
        let secondsLeft = this.confirmSeconds;
        this.clearInactive();
        this.clearInterval();
        this.intervalTrigger = setInterval(() => {
            if (secondsLeft <= 0) {
                this.closeRoom();
            } else {
                secondsLeft = secondsLeft - 1;
            }
        },                                 1000);
        this.plConfirmService.show({
            header: 'Are you still there?',
            content: `<div>It seems like you have not been active for awhile so we will automatically close this room in 60 seconds.
             If you are still here, just say so!</div>`,
             // Dialog component is not getting updates to variables.
             // <div>Closing in ${secondsLeft} seconds..</div>`,
            primaryLabel: `Keep the room open`,
            secondaryLabel: 'Close the room',
            primaryCallback: () => {
                this.clearInterval();
                this.resetTimer();
            },
            secondaryCallback: () => {
                this.closeRoom();
            },
            closeCallback: () => {
                this.clearInterval();
                this.resetTimer();
            },
        });
    }
};
