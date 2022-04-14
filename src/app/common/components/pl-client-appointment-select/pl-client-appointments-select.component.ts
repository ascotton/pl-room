import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import {
    PLLodashService,
    PLGQLClientsService,
    PLTimezoneService,
    PLUrlsService,
} from '@root/index';

import {
    PLRecordRoomService,
} from '@common/services-ng2/pl-records';

import { Subscription } from 'rxjs';
import { User } from '@modules/user/user.model';

@Component({
    selector: 'pl-client-appointments-select',
    templateUrl: './pl-client-appointments-select.component.html',
    styleUrls: ['./pl-client-appointments-select.component.less'],
})

export class PLClientAppointmentsSelectComponent implements OnInit, OnDestroy {
    @Output() readonly clientAppointmentSelected = new EventEmitter<any>();

    @Input() loadClients = false;
    @Input() currentUser: User;
    @Input() evaluationBillingCode: any;
    @Input() dialogMode = false;

    loadingAppointments: boolean;

    clientAppointments = [];
    selectOptsClientAppointments: any;
    selectedClientAppointmentId: string;
    loading: boolean;
    selectedClientService: {};
    canRecordSelectedClient = false;
    appointmentsSubscription: Subscription;
    urls: any;

    linkIconColor = '';
    inputPlaceholderColor = '';
    linkClass = '';

    constructor(private plRecordRoom: PLRecordRoomService,
                private plLodash: PLLodashService,
                private plGQLClients: PLGQLClientsService,
                private plTimezone: PLTimezoneService,
                private plUrls: PLUrlsService,
                ) {

    }

    ngOnInit() {
        this.urls = this.plUrls.urls;
    }

    ngOnChanges() {
        if (this.loadClients) {
            this.getClientAppointments();
        }
        this.linkIconColor = this.dialogMode ? 'blue-medium' : 'blue-lighter';
        this.linkClass = this.dialogMode ? 'light-link' : '';
        this.inputPlaceholderColor = this.dialogMode ? 'black' : 'gray-lighter';
    }

    ngOnDestroy() {
    }

    openSchedule() {
        const url = `${this.urls.scheduleFE }/calendar/${this.currentUser.uuid}`;
        window.open(url, '_blank');
    }

    refreshClientAppointments() {
        this.loadingAppointments = true;
        this.plRecordRoom.refreshClientAppointmentsData(this.currentUser);
    }

    getClientAppointments() {
        this.loadingAppointments = true;

        // We are no longer making this call to updateTodaysClients with a user defined here. Instead,
        // PLRecordRoomService itself now monitors the currentUser and updates accordingly. We only need
        // subscribe to getData(), and it will update any time currentUser changes in PLRecordRoomService.
        // JB - Feb 3rd, 2020
        // this.plRecordRoom.updateTodaysClients(this.currentUser);
        this.appointmentsSubscription = this.plRecordRoom.getClientAppointmentsData()
            .subscribe((results: any) => {
                if (!results.clients) {
                    return;
                }
                const resultsClone = results.clients.slice(0);
                const filteredClientAppointments = this.evaluationBillingCode ?
                    this.plRecordRoom.filterClientsByBillingCode(resultsClone,
                                                                 this.evaluationBillingCode.uuid)
                    : resultsClone;
                const clientAppointments = this.formatClientAppointments(
                    filteredClientAppointments,
                    this.currentUser.xProvider.timezone);
                this.clientAppointments = this.plLodash.sort2d(clientAppointments, 'xSortString');
                this.clientAppointments.forEach((appt: any) => {
                    appt.appointmentId = this.formClientAppointmentId(appt);
                });
                this.selectOptsClientAppointments =
                    this.clientAppointments.map((clientAppointment: any, index: number) => {
                        // May not have an appointment (id) yet, just the event.
                        return {
                            // value: this.formClientAppointmentId(clientAppointment),
                            value: clientAppointment.appointmentId,
                            label:
                            `${clientAppointment.xTime}, ${clientAppointment.first_name} ${clientAppointment.last_name.slice(0, 1)}.`,
                        };
                    },
                );
                if (this.clientAppointments.length === 1) {
                    this.selectedClientAppointmentId = this.clientAppointments[0].appointmentId;
                    this.clientAppointmentSelectionChange();
                }
                this.loadingAppointments = false;
            });
    }

    formClientAppointmentId(clientAppointment: any) {
        return `${clientAppointment.uuid}${clientAppointment.appointment.uuid}`;
    }

    formatClientAppointments(clientAppointments: any, timezone: any) {
        return clientAppointments.map((clientAppointment: any, index: number) => {
            const timeMoment = moment.tz(clientAppointment.appointment.start, this.plTimezone.formatDateTime,
                                         timezone);
            const xTime = timeMoment.format('h:mma');
            const xTimeMilitary = timeMoment.format('HH:mm');
            return Object.assign(clientAppointment, {
                xTime,
                xInstanceId: this.formClientAppointmentId(clientAppointment),
                xExpanded: true,
                xSortString: `${xTimeMilitary} ${clientAppointment.first_name} ${clientAppointment.last_name}`,
            });
        });
    }

    clientAppointmentSelectionChange() {
        // Not getting updated values immediately so need timeout.
        setTimeout(() => {
            const selectedClientAppointment = this.clientAppointments.find(
                (clientAppointment: any, index: number) => {
                    return this.selectedClientAppointmentId === clientAppointment.appointmentId;
                });
            if (selectedClientAppointment && selectedClientAppointment.uuid) {
                this.plGQLClients.getById(selectedClientAppointment.uuid).subscribe(
                    (resClient: any) => {
                        const client = resClient.client;
                        this.clientAppointmentSelected.emit({client, selectedClientAppointment});
                    },
                );

            }
        },         0);
    }
}
