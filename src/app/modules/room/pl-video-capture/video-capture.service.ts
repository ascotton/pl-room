import { Injectable, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { first, tap, filter } from 'rxjs/operators';
import { Observable, Subscription, BehaviorSubject, Subject, forkJoin } from 'rxjs';
import { User } from '@modules/user/user.model';
import { selectAuth } from '@modules/user/store';
import { AppState } from '@app/store';

import { PLUrlsService } from '@root/index';
import { PLHttpService } from '@root/src/lib-components/';
import { PLApiFileAmazonService } from '@lib-components/api';

import { FilteredCanvasService } from '@root/src/app/common/services/filtered-canvas.service';

import {
    PLRecordRoomService,
} from '@common/services-ng2/pl-records';
import {
    PLTimezoneService,
} from '@lib-components/index';
import * as moment from 'moment-timezone';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PLSaveCaptureDialogComponent, PLSaveCaptureDialogData, CAPTURE_SAVE_MODE } from './pl-save-capture-dialog/pl-save-capture-dialog.component';

export interface VideoCaptureSession {
    name: string;
    client: any;
    downloadUrls: string[];
}

@Injectable()
export class VideoCaptureService implements OnDestroy{
    public localCaptureMode = true;

    currentSession: VideoCaptureSession;
    currentCapture: any;
    usersSubscription: Subscription;
    currentUser: User;
    lastCaptureFileKey: string;

    private nextCaptureSource = new Subject<any>();
    nextCapture$ = this.nextCaptureSource.asObservable();

    private earlyCaptureSource = new Subject<any>();
    earlyCapture$ = this.earlyCaptureSource.asObservable();

    private jumbotronTargetSource = new BehaviorSubject<any>(null);
    jumbotronTarget$ = this.jumbotronTargetSource.asObservable();

    private isCapturingSource = new BehaviorSubject<boolean>(null);
    isCapturing$ = this.isCapturingSource.asObservable();

    providerUserId: string;
    currentJumbotronRecord: any;
    lastItem: any;
    lastCaptureUrl: any;
    amazonUrls = [];
    todaysDateDisplay: any;
    ignoreNextCaptureDirectory: any;

    jumbotronUrl: string;

    saveDialogOpen: any;
    saveDialogRef: MatDialogRef<PLSaveCaptureDialogComponent, any>;
    currentClient: any;
    currentVideoId: any;
    restoreSaveDialog: boolean;
    pendingSaveData: [any, any, any];
    lastCaptureImage: any;
    thumbnailItem: any;

    constructor(public dialog: MatDialog,
                private plHttp: PLHttpService,
                private plUrls: PLUrlsService,
                private store: Store<AppState>,
                private plRecordRoom: PLRecordRoomService,
                private plFileAmazon: PLApiFileAmazonService,
                private filteredCanvas: FilteredCanvasService,
                private plTimezone: PLTimezoneService) {
        this.jumbotronUrl = this.plUrls.urls.jumbotron;
        this.checkForExistingJumbotron();

        this.usersSubscription = this.store.select(selectAuth).pipe(
            filter(({ isAuthenticated }) => isAuthenticated),
        ).subscribe(({ user }) => {
            this.currentUser = user;
            this.providerUserId = this.currentUser.uuid;
            if (this.providerUserId) {
                this.pregenerateUploadUrls(3);
                const todayDate = this.plTimezone.getUserToday(user);
                this.todaysDateDisplay = moment(todayDate).format('MM/DD/YYYY');
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

    ngOnDestroy() {
        this.usersSubscription.unsubscribe();
    }

    handleOffline() {
        if (this.saveDialogOpen) {
            this.closeSaveDialog();
            this.restoreSaveDialog = true;
        }
    }

    handleOnline() {
        setTimeout(
            () => {
                if (this.restoreSaveDialog) {
                    this.save(...this.pendingSaveData);
                    this.restoreSaveDialog = false;
                }
            },
            500,
        );
    }
    closeSaveDialog(): void {
        if (this.saveDialogRef) {
            this.saveDialogRef.close();
        }
    }

    checkForExistingJumbotron() {
        const existingJumbotronId = localStorage.getItem('pl-jumbotron-id');
        const existingJumbotronClientDisplayName = localStorage.getItem('pl-jumbotron-client');
        if (existingJumbotronId && existingJumbotronClientDisplayName) {
            this.getJumbotron(existingJumbotronId).pipe(first()).subscribe(
                (result) => {
                    if (result.items_count > 0) {
                        this.save(existingJumbotronClientDisplayName, result, CAPTURE_SAVE_MODE.EXISTING)
                        .pipe(first()).subscribe();
                    } else {
                        this.deleteJumbotron(existingJumbotronId);
                    }
                },
            );
        }
    }

    startNewSession(clientAppointment, client, videoId) {
        this.jumbotronTargetSource.next(videoId);
        this.currentClient = client;
        this.currentVideoId = videoId;

        const name = `${client.firstName}-${client.lastName}-${this.todaysDateDisplay}`;
        this.currentSession = {
            name,
            client: clientAppointment.uuid,
            downloadUrls: [],
        };

        // pre-create client record if needed, then create jumbotron record
        return new Observable((observer: any) => {
            const recordReady = () => {
                this.createJumbotronRecord(clientAppointment.record.uuid, name)
                .pipe(first()).subscribe(
                    (jumboRecord: any) => {
                        const clientDisplayName = `${this.currentClient.firstName}${this.currentClient.lastName ? ` ${this.currentClient.lastName}` : ''}`;
                        localStorage.setItem('pl-jumbotron-client', clientDisplayName);
                        localStorage.setItem('pl-jumbotron-id', jumboRecord.uuid);
                        observer.next(jumboRecord);
                    },
                );
            };
            if (!clientAppointment.record.uuid) {
                this.plRecordRoom.saveRecord(clientAppointment.record, clientAppointment.uuid,
                                             clientAppointment.record.appointment,
                                             clientAppointment.appointment.event, this.providerUserId)
                    .pipe(first()).subscribe((resRecord: any) => {
                        clientAppointment.record = Object.assign(clientAppointment.record, resRecord.record);
                        recordReady();
                    });
            } else {
                recordReady();
            }
        });
    }

    createJumbotronRecord(recordId, name) {
        return new Observable((observer: any) => {
            const data = { name, record: recordId, status: 'in_progress' };
            this.plHttp.save('jumbotron', data).pipe(first()).subscribe(
                (resRecord) => {
                    this.currentJumbotronRecord = resRecord;
                    observer.next(this.currentJumbotronRecord);
                },
                (err) => {
                    console.log('jumbotron record error: ', err);
                    observer.error(err);
                });
        });
    }

    clientExiting(clientGuid) {
        if (this.currentVideoId === clientGuid) {
            this.saveCurrentJumbotronSession(CAPTURE_SAVE_MODE.ON_EXIT).pipe(first()).subscribe(
                (saveResult) => {
                    // console.log('saveResult: ', saveResult);
                },
            );
        }
    }

    clientInterrupted(clientGuid) {
        if (this.currentVideoId === clientGuid) {
            if (this.currentSession.downloadUrls.length > 0) {
                this.saveCurrentJumbotronSession(CAPTURE_SAVE_MODE.INTERRUPTED).pipe(first()).subscribe();
            } else {
                this.cancel();
            }
        }
    }

    saveCurrentJumbotronSession(_saveMode?: string) {
        const saveMode = _saveMode ? _saveMode : CAPTURE_SAVE_MODE.DEFAULT;
        const clientDisplayName = `${this.currentClient.firstName}${this.currentClient.lastName ? ` ${this.currentClient.lastName}` : ''}`;
        return this.save(clientDisplayName, this.currentJumbotronRecord, saveMode);
    }

    private save(clientDisplayName, jumbotronRecord, saveMode) {
        this.pendingSaveData = [clientDisplayName, jumbotronRecord, saveMode];
        return new Observable((observer: any) => {
            if (this.saveDialogOpen) {
                observer.error('Already Saving');
            }
            this.saveDialogOpen = true;
            const currentSessionName = jumbotronRecord.name;
            this.saveDialogRef = this.dialog.open(PLSaveCaptureDialogComponent, {
                width: '450px',
                panelClass: 'pl-dialog-container',
                disableClose: true,
                data: {
                    saveMode,
                    clientName: clientDisplayName,
                    sessionName: currentSessionName,
                },
            });

            this.saveDialogRef.afterClosed().pipe(first()).subscribe((result: PLSaveCaptureDialogData) => {
                this.saveDialogOpen = false;
                if (result) {
                    if (result.discard) {
                        this.deleteJumbotron(jumbotronRecord.uuid).pipe(first()).subscribe((res) => {
                            this.clearSession();
                            observer.next(res);
                        });
                    } else {
                        const saveName = result.sessionName;
                        this.saveCompletedJumbotronRecord(saveName, jumbotronRecord).pipe(first()).subscribe((res) => {
                            this.clearSession();
                            observer.next(res);
                        });
                    }
                }
            });
        });
    }

    saveCompletedJumbotronRecord(saveName: string, jumbotronRecord) {
        return new Observable((observer: any) => {
            const data = { name: saveName, status: 'completed', uuid: jumbotronRecord.uuid };
            this.plHttp.save('jumbotron', data).pipe(first()).subscribe(
                (resRecord) => {
                    this.clearSession();
                    observer.next(resRecord);
                },
                (err) => {
                    console.log('jumbotron record error: ', err);
                    this.clearSession();
                    observer.error(err);
                });
        });
    }

    private clearSession() {
        this.jumbotronTargetSource.next(null);
        localStorage.removeItem('pl-jumbotron-id');
        localStorage.removeItem('pl-jumbotron-client');

        this.currentJumbotronRecord = null;
        this.currentClient = null;
        this.currentVideoId = null;
        this.currentSession = null;
    }

    cancelCapture() {
        this.ignoreNextCaptureDirectory = this.currentCapture.directory;
        this.isCapturingSource.next(false);
    }

    cancel() {
        return new Observable((observer: any) => {
            this.deleteJumbotron(this.currentJumbotronRecord.uuid).pipe(first()).subscribe(
                (result) => {
                    this.clearSession();
                    observer.next(result);
                },
                (error) => {
                    this.clearSession();
                    observer.error(error);
                },
            );
        });
    }

    getJumbotron(id) {
        const url = `${this.jumbotronUrl}${id}/`;
        return this.plHttp.get(null, {}, url);
    }

    deleteItem(jumbotronId, itemId) {
        const url = `${this.jumbotronUrl}${jumbotronId}/items/${itemId}`;
        return this.plHttp.delete(null, {}, url);
    }

    deleteJumbotron(jumbotronId) {
        const url = `${this.jumbotronUrl}${jumbotronId}/`;
        return this.plHttp.delete(null, {}, url);
    }

    capture(videoElement: HTMLVideoElement, amazonUrl, flipped?: boolean, mirrored?: boolean) {
        return new Observable((observer) => {
            const offscreen: HTMLCanvasElement = document.createElement('canvas');
            offscreen.width = 640;
            offscreen.height = 480;

            const ctx = offscreen.getContext('2d');
            if (mirrored) {
                ctx.translate(offscreen.width, 0);
                ctx.scale(-1, 1);
            }
            if (flipped) {
                ctx.translate(offscreen.width / 2, offscreen.height / 2);
                ctx.rotate(Math.PI);
                ctx.drawImage(videoElement, -offscreen.width / 2, -offscreen.height / 2);
            } else {
                ctx.drawImage(videoElement, 0, 0);
            }
            const type = 'image/png';
            const dataUrl = offscreen.toDataURL(type);
            this.earlyCaptureSource.next(dataUrl);
            this.filteredCanvas.blurFaces(offscreen).then(
                (blurResult) => {
                    const finalImage = blurResult ? blurResult : offscreen;
                    this.lastCaptureImage = finalImage;
                    this.earlyCaptureSource.next(finalImage.toDataURL(type));
                    this.uploadResult(finalImage, amazonUrl, type).subscribe(
                        (uploadResult: any) => {
                            observer.next(uploadResult);
                            observer.complete();
                        },
                        (error) => {
                            observer.error(error);
                        }
                    );
                },
            );
        });
    }

    private uploadResult(filteredResult: any, amazonUrl: any, type: string) {
        return new Observable((observer) => {
            filteredResult.toBlob(
                (blob) => {
                    const fileName = `screenshot${Date.now()}.png`;
                    this.uploadBlob(blob, fileName, amazonUrl).pipe(first()).subscribe(
                        (result: any) => {
                            observer.next(result);
                            observer.complete();
                        },
                        (error) => {
                            observer.error(error);
                        }
                    );
                },
                type
            );
        });
    }

    nextCaptureReceived(captureFileKey, videoGuid) {
        if (this.ignoreNextCaptureDirectory && captureFileKey.indexOf(this.ignoreNextCaptureDirectory) >= 0) {
            return;
        }
        this.lastCaptureFileKey = captureFileKey;
        this.postItem(captureFileKey).pipe(first()).subscribe(
            (result: any) => {
                this.lastItem = result;
                this.lastCaptureUrl = result.download_url;
                this.currentSession.downloadUrls.push(result.download_url);
                result.videoGuid = videoGuid;

                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    this.isCapturingSource.next(false);
                    if (this.currentSession.downloadUrls.length === 1) {
                        this.createThumbnail(img);
                    }
                    this.nextCaptureSource.next(result);
                };
                img.src = result.download_url;
            },
            (error) => {
                console.log('postItem error: ', error);
            },
        );
    }

    createThumbnail(img) {
        const offscreen: any = document.createElement('canvas');
        offscreen.width = 160;
        offscreen.height = 120;

        const ctx = offscreen.getContext('2d');
        ctx.drawImage(img, 0, 0, 160, 120);
        const type = 'image/png';
        offscreen.toBlob(
            (blob) => {
                const fileName = `thumbnail${Date.now()}.png`;
                this.getNextAmazonUrl().pipe(first()).subscribe(
                    (amazonUrl) => {
                        this.uploadBlob(blob, fileName, amazonUrl).subscribe(
                            (result: any) => {
                                this.postItem(result.key).subscribe(
                                    (res: any) => {
                                        this.thumbnailItem = res;
                                        const data = {
                                            uuid: this.currentJumbotronRecord.uuid,
                                            thumbnail_item: res.uuid,
                                        };
                                        this.plHttp.save('jumbotron', data).pipe(first()).subscribe(
                                            (resRecord) => {
                                            },
                                            (err) => {
                                            });
                                    }
                                )
                            },
                            (error) => {
                            },
                        );
                    }
                );
            },
            type,
        );
    }

    postItem(captureFileKey: string) {
        return new Observable((observer: any) => {
            const data = { file_path: captureFileKey };
            const url = `${this.jumbotronUrl}${this.currentJumbotronRecord.uuid}/items/`;
            this.plHttp.save(null, data, url).pipe(first()).subscribe(
                (resItem) => {
                    observer.next(resItem);
                },
                (err) => {
                    console.log('jumbotron record error: ', err);
                    observer.error(err);
                });
        });
    }

    pregenerateUploadUrls(count) {
        const urls = Array.from({ length: count });
        const generators = [];
        urls.forEach(item => generators.push(this.generateAmazonUrl()));
        forkJoin(generators).subscribe((allResult) => {
            allResult.forEach(
                (result: any) => {
                    if (result != null && result.url) this.amazonUrls.push(result);
                },
            );
        });
    }

    generateAmazonUrl() {
        return this.plFileAmazon.getAmazonUrl({ namespace: 'jumbotron' });
    }

    getNextAmazonUrl() {
        return new Observable((observer: any) => {
            if (this.amazonUrls.length > 2) {
                // pop an existing one and return it right away
                observer.next(this.amazonUrls.pop());
            } else {
                this.generateAmazonUrl().pipe(first()).subscribe(
                    (result) => {
                        observer.next(result);
                        // refill some URLs
                        this.pregenerateUploadUrls(3);
                    },
                );
            }
        });
    }

    startCapture(videoElement: HTMLVideoElement, streamId: string) {
        return new Observable((observer: any) => {
            this.isCapturingSource.next(true);
            this.getNextAmazonUrl().pipe(first()).subscribe(
                (captureUrl) => {
                    this.currentCapture = captureUrl;
                    this.capture(videoElement, captureUrl).subscribe(
                        (result: any) => {
                            this.nextCaptureReceived(result.key, streamId);
                            observer.next();
                        },
                    );
                },
            );
        });
    }

    uploadBlob(blob, fileName, amazonUrl) {
        const file = new File([blob], fileName);
        return new Observable((observer: any) => {
            this.plFileAmazon
                .uploadBulk([file], amazonUrl.url, amazonUrl.fields, `0_`, [fileName])
                .subscribe(
                    (resFiles: any) => {
                        observer.next(resFiles[0]);
                    },
                    (err: any) => {
                        observer.error(err);
                    },
            );
        });
    }

    retake(): void {
        this.deleteItem(this.currentJumbotronRecord.uuid, this.lastItem.uuid).subscribe(
            (result) => {
                if (this.currentSession.downloadUrls.length === 1) {
                    this.deleteItem(this.currentJumbotronRecord.uuid, this.thumbnailItem.uuid).subscribe(
                        (deleteResult) => {
                        }
                    );
                }
                this.currentSession.downloadUrls.pop();
            }
        )
    }
}
