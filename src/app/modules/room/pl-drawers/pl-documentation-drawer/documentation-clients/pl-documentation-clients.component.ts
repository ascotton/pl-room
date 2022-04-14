import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import {
    PLLodashService,
    PLUrlsService,
    PLTimezoneService,
} from '@root/index';

import {
    PLRecordRoomService,
} from '@common/services-ng2/pl-records';

import { User } from '@app/modules/user/user.model';
import { selectAuth } from '@modules/user/store';
import { AppState } from '@app/store';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pl-documentation-clients',
    templateUrl: './pl-documentation-clients.component.html',
    styleUrls: ['./pl-documentation-clients.component.less']
})
export class PLDocumentationClientsComponent implements OnInit, OnDestroy {
    subscription: Subscription;

    currentUser: User;
    loading: boolean = true;
    clientAppointments: any = [];
    urls: any = {};

    selectedClientAppointmentIds: string[] = [];
    clientAppointmentsForceChange: boolean = false;
    selectOptsClientAppointments: any[] = [];
    selectedClientAppointments: any[] = [];
    providerUserId: string = '';

    localStorageKey: string = 'documentationClients';
    localStorageData: any = {};
    isBlackoutDay: boolean;

    constructor(
        private plRecordRoom: PLRecordRoomService,
        private store: Store<AppState>,
        private plLodash: PLLodashService,
        private plUrls: PLUrlsService,
        private plTimezone: PLTimezoneService,
    ) {
    }

    ngOnInit() {
        this.subscription = this.store.select(selectAuth)
            .subscribe(({ isAuthenticated, user }) => {
                if (isAuthenticated) {
                    this.currentUser = user;
                    this.providerUserId = this.currentUser.uuid;
                    this.getClientAppointments();
                }
            });
        this.urls = this.plUrls.urls;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    refreshClientAppointments() {
        this.loading = true;
        this.plRecordRoom.refreshClientAppointmentsData(this.currentUser);
    }

    getClientAppointments() {
        this.loading = true;

        // We are no longer making this call to updateTodaysClients with a user defined here. Instead,
        // PLRecordRoomService itself now monitors the currentUser and updates accordingly. We only need
        // subscribe to getData(), and it will update any time currentUser changes in PLRecordRoomService.
        // JB - Feb 3rd, 2020
        // this.plRecordRoom.updateTodaysClients(this.currentUser);
        this.plRecordRoom.getClientAppointmentsData()
            .subscribe((resClientAppointments: any) => {
                if (!resClientAppointments.clients) {
                    return;
                }

                const clientAppointments = this.formatClientAppointments(resClientAppointments.clients);
                this.clientAppointments = this.plLodash.sort2d(clientAppointments, 'xSortString');
                this.selectOptsClientAppointments = this.clientAppointments.map((clientAppointment: any, index: number) => {
                    // May not have an appointment (id) yet, just the event.
                    return { 'value': this.formClientAppointmentId(clientAppointment), 'label':
                        `${clientAppointment.xTime}, ${clientAppointment.first_name} ${clientAppointment.last_name.slice(0, 1)}.` };
                });
                // Load state from local storage and pre-select if necessary.
                let data: any;
                try {
                    data = localStorage.getItem(this.localStorageKey);
                } catch (e) {
                    console.debug('localStorage error in PLDocumentationClientsComponent');
                }
                if (data) {
                    data = JSON.parse(data);
                    if (data.selectedClientAppointmentIds) {
                        // Could just set them directly, but in case an appointment was removed, check
                        // that it still exists first.
                        const selectedIds = [];
                        data.selectedClientAppointmentIds.forEach((id: string) => {
                            if (this.plLodash.findIndex(this.selectOptsClientAppointments, 'value', id) > -1) {
                                selectedIds.push(id);
                            }
                        });
                        this.selectedClientAppointmentIds = selectedIds;
                        this.selectClientAppointments();
                        this.setBlackoutDayForSelectedClients()
                    }
                }
                this.loading = false;
            });
    }

    setBlackoutDayForSelectedClients() {
        if (!this.selectedClientAppointments.length) {
            this.isBlackoutDay = false;
            return;
        }
        this.isBlackoutDay = this.selectedClientAppointments.find((_: any) => _.appointment.is_blacked_out)
            || localStorage.getItem('DEBUG_BLACKOUT_DAY');
    }

    formClientAppointmentId(clientAppointment: any) {
        return `${clientAppointment.uuid}${clientAppointment.appointment.uuid}`;
    }

    formatClientAppointments(clientAppointments: any) {
        return clientAppointments.map((clientAppointment: any, index: number) => {
            let timeMoment = moment.tz(clientAppointment.appointment.start, this.plTimezone.formatDateTime, this.currentUser.xProvider.timezone);
            let xTime = timeMoment.format('h:mma');
            let xTimeMilitary = timeMoment.format('HH:mm');
            return Object.assign(clientAppointment, {
                xInstanceId: this.formClientAppointmentId(clientAppointment),
                xTime: xTime,
                xExpanded: true,
                xSortString: `${xTimeMilitary} ${clientAppointment.first_name} ${clientAppointment.last_name}`,
            });
        });
    }

    selectClientAppointments() {
        // Not getting updated values immediately so need timeout.
        setTimeout(() => {
            this.selectedClientAppointments = this.clientAppointments.filter((clientAppointment: any, index: number) => {
                return this.selectedClientAppointmentIds.includes(this.formClientAppointmentId(clientAppointment));
            });
            this.setBlackoutDayForSelectedClients()
            // Update local storage.
            this.localStorageData.selectedClientAppointmentIds = this.selectedClientAppointmentIds;
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageData));
        }, 0);
    }

    removeSelectedClientAppointment(clientAppointmentId) {
        const index = this.selectedClientAppointmentIds.indexOf(clientAppointmentId);
        if (index > -1) {
            this.selectedClientAppointmentIds.splice(index, 1);
            this.selectClientAppointments();
            this.clientAppointmentsForceChange = !this.clientAppointmentsForceChange;
        }
    }

    toggleClientAppointment(clientAppointment: any, index: number) {
        this.selectedClientAppointments[index].xExpanded = !this.selectedClientAppointments[index].xExpanded;
    }
}
