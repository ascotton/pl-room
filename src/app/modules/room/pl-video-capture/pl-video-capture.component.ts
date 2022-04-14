import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VideoCaptureService } from './video-capture.service';

import { PLClientSelectDialogComponent, ClientDialogData } from './pl-client-select-dialog/pl-client-select-dialog.component';
import { PLCapturePreviewDialogComponent, PREVIEW_CHOICE } from './pl-capture-preview-dialog/pl-capture-preview-dialog.component';

import { first, filter } from 'rxjs/operators';

import {
    ConferenceActions,
} from '@conference/store';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';

@Component({
    selector: 'pl-video-capture',
    templateUrl: './pl-video-capture.component.html',
    styleUrls: ['./pl-video-capture.component.less'],
})
export class PLVideoCaptureComponent implements OnInit, OnChanges, OnDestroy {
    _activated = false;

    clientDialogOpen: boolean;
    client: any;
    clientDialogRef: MatDialogRef<PLClientSelectDialogComponent, any>;
    clientAppointment: any;
    clientSelected: boolean;

    @Output() readonly videoCaptureComplete = new EventEmitter<any>();
    nextCaptureSub: any;
    nextCaptureItem: any;
    nextCaptureItemUrl: string;

    previewDialogOpen: any;
    previewDialogRef: MatDialogRef<PLCapturePreviewDialogComponent, any>;

    @Input() videoGuid = 'null';
    currentJumbotronSub: any;
    restoreClientDialog: boolean;
    restorePreviewDialog: boolean;
    earlyCaptureSub: any;
    earlyCaptureDataUrl: any;
    isCapturingSub: any;
    waitingForCapture: boolean;

    @Input()
    set activated(val) {
        if (!this._activated && val) {
            this.openClientDialog();
        } else if (this._activated && !val) {
            this.closeClientDialog();
        }
        this._activated = val;
    }

    constructor(private store: Store<AppState>,
                public dialog: MatDialog,
                private vidCaptureService: VideoCaptureService,
                private zone: NgZone,) {}

    ngOnInit(): void {
        this.nextCaptureSub = this.vidCaptureService.nextCapture$
        .pipe(
            filter(({ videoGuid }) => videoGuid === this.videoGuid),
        )
        .subscribe((nextCaptureItem) => {
            this.nextCaptureItem = nextCaptureItem;
            this.nextCaptureItemUrl = this.nextCaptureItem.download_url;
            this.earlyCaptureDataUrl = null;
            if (this.nextCaptureItem) {
                this.store.dispatch(ConferenceActions.stopCapturing());
                this.openCapturePreviewDialog();
            }
        });

        this.earlyCaptureSub = this.vidCaptureService.earlyCapture$
        .subscribe((earlyCaptureDataUrl) => {
            this.earlyCaptureDataUrl = earlyCaptureDataUrl;
        });

        this.isCapturingSub = this.vidCaptureService.isCapturing$
        .subscribe((value) => {
            this.zone.run(() => {
                this.waitingForCapture = value;
            });
        });

        this.currentJumbotronSub = this.vidCaptureService.jumbotronTarget$.subscribe((videoId) => {
            if (videoId !== this.videoGuid && this.previewDialogOpen) {
                this.previewDialogRef.close();
            }
        });

        window.addEventListener(
            'offline',
            () => {
                this.handleOffline();
            },
        );
        window.addEventListener(
            'online',
            () => {
                this.handleOnline();
            },
        );
    }

    ngOnChanges(changes): void {
    }

    ngOnDestroy() {
        this.nextCaptureSub.unsubscribe();
        this.currentJumbotronSub.unsubscribe();
        this.earlyCaptureSub.unsubscribe();
        this.isCapturingSub.unsubscribe();
    }

    handleOffline() {
        if (this.clientDialogOpen) {
            this.closeClientDialog();
            this.restoreClientDialog = true;
        }
        if (this.previewDialogOpen) {
            this.closeCapturePreviewDialog();
            this.restorePreviewDialog = true;
        }
    }

    handleOnline() {
        setTimeout(
            () => {
                if (this.restoreClientDialog) {
                    this.openClientDialog();
                    this.restoreClientDialog = false;
                }
                // if (this.restorePreviewDialog) {
                //     this.openCapturePreviewDialog();
                //     this.restorePreviewDialog = false;
                // }
            },
            0,
        );
    }

    openCapturePreviewDialog() {
        if (this.previewDialogOpen || !this.vidCaptureService.currentSession) {
            return;
        }
        this.previewDialogRef = this.dialog.open(PLCapturePreviewDialogComponent, {
            width: '80%',
            height: '80%',
            panelClass: 'pl-dialog-container',
            disableClose: true,
            data: {
                imageUrls: this.vidCaptureService.currentSession.downloadUrls,
                nextCaptureUrl: this.vidCaptureService.lastCaptureUrl,
            },
        });
        this.previewDialogOpen = true;

        this.previewDialogRef.afterClosed().subscribe((result: string) => {
            this.previewDialogOpen = false;
            if (result) {
                switch (result) {
                        case PREVIEW_CHOICE.CANCEL:
                            this.cancel();
                            break;

                        case PREVIEW_CHOICE.RETAKE:
                            this.retake();
                            break;

                        case PREVIEW_CHOICE.TAKE_MORE:
                            break;

                        case PREVIEW_CHOICE.SAVE:
                            this.save();
                            break;

                        default:
                            break;
                }
            } else {
            }
        });
    }

    closeCapturePreviewDialog(): void {
        if (this.previewDialogRef) {
            this.previewDialogRef.close();
        }
    }

    cancelClicked(): void {
        if (this.vidCaptureService.currentSession.downloadUrls.length) {
            this.save();
        } else {
            this.cancel();
        }
    }

    save() {
        if (this.videoGuid === this.vidCaptureService.currentVideoId) {
            this.vidCaptureService.saveCurrentJumbotronSession().pipe(first()).subscribe(
                (result) => {
                    this.close();
                });
        }
    }

    close(): void {
        this._activated = false;
        this.videoCaptureComplete.emit();
        this.store.dispatch(ConferenceActions.stopCapturing());
    }

    cancel() {
        if (this.videoGuid === this.vidCaptureService.currentVideoId) {
            this.vidCaptureService.cancel().pipe(first()).subscribe(
                (result) => {
                    this.close();
                });
        }
    }

    requestCancelCapture() {
        this.store.dispatch(ConferenceActions.stopCapturing());
        this.vidCaptureService.cancelCapture();
    }

    retake() {
        if (this.videoGuid === this.vidCaptureService.currentVideoId) {
            this.vidCaptureService.retake();
        }
    }

    openClientDialog(): void {
        if (this.clientDialogOpen) {
            return;
        }
        this.client = null;
        this.clientDialogOpen = true;
        this.clientDialogRef = this.dialog.open(PLClientSelectDialogComponent, {
            width: '450px',
            panelClass: 'pl-dialog-container',
            disableClose: true,
            data: {},
        });

        this.clientDialogRef.afterClosed().subscribe((result: ClientDialogData) => {
            this.clientDialogOpen = false;
            if (result) {
                this.client = result.client;
                this.clientAppointment = result.clientAppointment;

                this.vidCaptureService.startNewSession(this.clientAppointment, this.client, this.videoGuid).
                    pipe(first()).subscribe(
                    (result: any) => {
                    },
                );
            } else {
                this.client = null;
                this.clientAppointment = null;
                this.close();
            }
            this.clientSelected = this.client !== null;
        });
    }
    closeClientDialog(): void {
        if (this.clientDialogRef) {
            this.clientDialogRef.close();
        }
    }
}
