import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import {
    PLUrlsService,
    PLApiBillingCodesService,
    PLConfirmDialogService,
    PLGraphQLService,
} from '@root/index';

import {
    PLRecordRoomService,
} from '@common/services-ng2/pl-records';

import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { User } from '@modules/user/user.model';
import { selectAuth } from '@modules/user/store';
import { AppState } from '@app/store';

@Component({
    selector: 'pl-session-record-controls',
    templateUrl: './pl-session-record-controls.component.html',
    styleUrls: ['./pl-session-record-controls.component.less'],
})

export class PLSessionRecordDrawerControlsComponent implements OnInit, OnDestroy {
    @ViewChild('screensharepreview', { static: false }) screenshareElement: any;

    usersSubscription: Subscription;
    tokboxSubscription: Subscription;

    sessionRecordDrawerActive: boolean;

    isRecording = false;
    postRecording = false;
    providerUserId = '';
    currentUser: User;
    urls: any = {};
    selectedClientServiceId: string;
    selectedClientService: {};
    clientServices: any;
    evaluationBillingCode: any;
    selectedClient: any;
    canRecordSelectedClient = false;
    showConsentFormMessage =  false;
    currentRecord: unknown;
    isScreensharing: boolean;
    waitingForScreenshare: boolean;
    loadClients: boolean;

    constructor(
                private plRecordRoom: PLRecordRoomService,
                private store: Store<AppState>,
                private plUrls: PLUrlsService,
                private plBillingCodes: PLApiBillingCodesService,
                private plConfirmService: PLConfirmDialogService,
                private plGraphQL: PLGraphQLService,
                ) {

    }

    ngOnInit() {
        this.usersSubscription = this.store.select(selectAuth)
            .subscribe(({ isAuthenticated, user }) => {
                if (isAuthenticated) {
                    this.plBillingCodes.get().pipe(first()).subscribe((res: any) => {
                        this.evaluationBillingCode = res.find(item => item.code === 'evaluation');
                        this.currentUser = user;
                        this.providerUserId = this.currentUser.uuid;
                        this.loadClients = true;
                    });
                }
            });

        this.tokboxSubscription = this.store.select('tokboxRecord').subscribe(
            (data: any) => {
                if (!data) {
                    return;
                }
                const type = data.type;
                const payload = data.payload;
                switch (type) {
                        case 'TOKBOX_RECORDING_SALVAGE':
                            this.handleRecordingSalvaged(payload);
                            return;
                        case 'TOKBOX_SCREENSHARE_UPDATE':
                            if (this.waitingForScreenshare) {
                                this.waitingForScreenshare = false;
                                if (payload.success) {
                                    this.startRecording();
                                }
                            }
                            return;
                }
            },
        );
        this.urls = this.plUrls.urls;
    }

    ngOnDestroy() {
        this.usersSubscription.unsubscribe();
        this.tokboxSubscription.unsubscribe();
    }

    handleRecordingSalvaged(payload) {
        if (payload.success) {
            this.showSalvageSuccessNotification(payload.clientIds, payload.archiveId);
        } else {
            this.showSalvageFailureNotification(payload.error);
        }
    }

    showSalvageSuccessNotification(clientIDs, archiveId) {
        this.plConfirmService.show({
            header: 'Session Recording Found',
            content: `<div>
                    A previous session recording was found and saved, you will find it in your client’s Events tab.
                    </div>`,

            primaryLabel: `View Client Events`,
            secondaryLabel: 'Cancel',
            primaryCallback: () => {
                window.open(`${this.urls.eduClientsFE}/client/${clientIDs[0]}/reports`, '_blank');
            },
            secondaryCallback: () => {
            },
            closeCallback: () => {
            },
        });
    }

    showSalvageFailureNotification(error) {
        this.plConfirmService.show({
            header: 'Session Recording Found',
            content: `<div>
                        A previous session recording was found but we were unable to recover it.
                    </div>
                    <div style="margin: 10px 0 10px 0;">
                        <strong>Error Message</strong>
                    </div>
                    <div>
                        <textarea rows="4" cols="60">${error}</textarea>
                    </div>`,

            primaryLabel: `OK`,
            secondaryLabel: 'Cancel',
            primaryCallback: () => {
            },
            secondaryCallback: () => {
            },
            closeCallback: () => {
            },
        });
    }

    setScreenshareForRecording(val) {
        this.isScreensharing = val;
        this.store.dispatch({ type: 'TOKBOX_SCREENSHARE_TOGGLE',
            payload: {
                screensharing: this.isScreensharing,
                screenshareElement: this.screenshareElement.nativeElement,
            },
        });
    }

    toggleRecording() {
        if (!this.isRecording) {
            this.showStartRecordingDialog();
        } else {
            this.isRecording = false;
            this.postRecording = true;
            this.setScreenshareForRecording(false);
            this.dispatchRecordingAction();
        }
    }

    dispatchRecordingAction() {
        const payload = {
            recording: this.isRecording,
            clientIDs: [this.selectedClient.id],
            record: this.currentRecord,
        };
        this.store.dispatch({ payload, type: 'TOKBOX_RECORD_TOGGLE' });
    }

    startRecording() {
        this.isRecording = true;
        this.postRecording = false;
        this.dispatchRecordingAction();
    }

    captureRoom() {
        this.setScreenshareForRecording(true);
        this.waitingForScreenshare = true;
    }
    showStartRecordingDialog() {
        this.plConfirmService.show({
            header: 'Start Session Recording',
            content: `<div>
                        You are about to begin recording the contents of your Room.
                        <strong>After clicking the Record Room button below,</strong> you will be prompted to select what screen to share.
                        <strong><em>Be sure to select your browser window of your Room.</em></strong>
                        When you are done recording, click <strong>Stop Recording.</strong>
                        The recording will be available in your client’s Events view.
                    </div>`,

            primaryLabel: `Record Room`,
            // secondaryLabel: 'Record Without Capture',
            secondaryLabel: 'Cancel',
            primaryCallback: () => {
                this.captureRoom();
            },
            secondaryCallback: () => {
                // this.startRecording();
            },
            closeCallback: () => {
            },
        });
    }

    clientAppointmentSelected(event) {
        const selectedClientAppointment = event.selectedClientAppointment;
        this.selectedClient = event.client;
        this.canRecordSelectedClient = this.selectedClient.recordingAllowed;
        if (this.canRecordSelectedClient) {
            this.showConsentFormMessage = false;
            this.preCreateRecord(selectedClientAppointment).pipe(first()).subscribe(
                (result) => {
                    this.currentRecord = result;
                },
            );
        } else {
            console.log('clientAppointmentSelected cannot record');
            this.showConsentFormMessage = true;
        }
    }

    preCreateRecord(clientAppointment) {
        return new Observable((observer: any) => {
            this.getClientServiceId().subscribe((serviceId) => {
                if (!clientAppointment.record.uuid ||
                    this.selectedClientServiceId !== clientAppointment.record.client_service) {
                    const record: any = Object.assign(clientAppointment.record, {
                        client_service: serviceId,
                    });
                    this.plRecordRoom.saveRecord(record, clientAppointment.uuid, record.appointment,
                                                 clientAppointment.appointment.event, this.providerUserId)
                        .pipe(first()).subscribe((resRecord: any) => {
                            clientAppointment.record = Object.assign(clientAppointment.record, resRecord.record);
                            observer.next(clientAppointment.record);
                        });
                } else {
                    observer.next(clientAppointment.record);
                }
            });
        });
    }

    getClientServiceId() {
        return new Observable((observer: any) => {
            // Reset.
            this.selectedClientServiceId = '';
            this.selectedClientService = {};
            const vars = {
                first: 100,
                clientId: this.selectedClient.id,
                compatibleWithProviderId: this.providerUserId,
                billingCodeId: this.evaluationBillingCode.uuid,
                status_In: 'not_started,in_process,idle',
            };
            const query = `query ClientServices(
                $first: Int!,
                $clientId: ID,
                $compatibleWithProviderId: String,
                $billingCodeId: UUID,
                $status_In: String,
            ) {
                clientServices(
                    first: $first,
                    clientId: $clientId,
                    compatibleWithProviderId: $compatibleWithProviderId,
                    billingCodeId: $billingCodeId,
                    status_In: $status_In
                ) {
                    totalCount
                    edges {
                        node {
                            ... on DirectService {
                                id
                                service {
                                    id
                                    code
                                    productType {
                                        id
                                        code
                                        name
                                    }
                                    serviceType {
                                        id
                                        code
                                        shortName
                                        longName
                                    }
                                }
                                startDate
                                endDate
                            }
                            ... on Evaluation {
                                id
                                service {
                                    id
                                    code
                                    productType {
                                        id
                                        code
                                        name
                                    }
                                    serviceType {
                                        id
                                        code
                                        shortName
                                        longName
                                    }
                                }
                            }
                            ... on ClientService {
                                id
                            }
                        }
                    }
                }
            }`;
            this.plGraphQL.query(query, vars, {}).subscribe((res: any) => {
                this.clientServices = res.clientServices;
                this.selectedClientServiceId = this.clientServices[0].id;
                observer.next(this.selectedClientServiceId);
            });
        });
    }
}
