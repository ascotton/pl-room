import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment-timezone';
import {
    PLTimezoneService,
} from '@lib-components/index';

export interface ClientDialogData {
    client: any;
    clientAppointment: any;
}

import { Store } from '@ngrx/store';
import { selectAuth } from '@modules/user/store';
import { AppState } from '@app/store';

@Component({
    selector: 'pl-client-select-dialog',
    templateUrl: './pl-client-select-dialog.component.html',
    styleUrls: ['./pl-client-select-dialog.component.less'],
})
export class PLClientSelectDialogComponent implements OnInit, OnDestroy  {

    currentUser: any;
    evaluationBillingCode = '';
    loadClients = false;
    usersSubscription: any;
    disableConfirm = true;
    todaysDateDisplay: string;

    constructor(public dialogRef: MatDialogRef<PLClientSelectDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: ClientDialogData,
                private store: Store<AppState>,
                private plTimezone: PLTimezoneService) {}

    ngOnInit() {
        this.usersSubscription = this.store.select(selectAuth)
            .subscribe(({ isAuthenticated, user }) => {
                if (isAuthenticated) {
                    this.currentUser = user;
                    this.loadClients = true;
                    const todayDate = this.plTimezone.getUserToday(user);
                    this.todaysDateDisplay = moment(todayDate).format('MM/DD/YYYY');
                }
            });
    }

    ngOnDestroy() {
        if (this.usersSubscription) {
            this.usersSubscription.unsubscribe();
        }
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    clientAppointmentSelected(evt) {
        this.disableConfirm = false;
        this.data.client = evt.client;
        this.data.clientAppointment = evt.selectedClientAppointment;
    }
}