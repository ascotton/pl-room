import { Injectable } from '@angular/core';
import { of, throwError, EMPTY } from 'rxjs';
import { concatMap, catchError, map, exhaustMap, tap, filter, switchMap, withLatestFrom, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppState } from '@app/store';
import { DevicesHistoryService, DevicesService } from '@common/media';
import { PluckDefinedResult, pluckDefinedWithId } from '@common/rxjs/operators';
import { SessionActions, Participant, selectLocalParticipant, selectSessionReady } from '@room/session/store';
import { ConferenceService } from '../conference.service';
import { ConferenceRTService } from '../conference-rt.service';
import {
    selectLocalStream,
    selectParticipantPrimaryStreamId,
    selectLocalSecondaryStreamId,
    selectHasLocalJoined,
    selectLocalPrimaryId,
    selectStreamIsMuted,
    selectStreamIsHidden,
    selectIsStreamVideoDeviceAvailable,
    selectIsConferenceConnected,
} from './conference.selectors';
import { StreamType, LocalStream } from './conference.model';
import { ConferenceActions, ConferenceActionTypes } from './conference.actions';

@Injectable()
export class ConferenceLocalStreamsEffects {

    addPrimaryLocalStream$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(SessionActions.addLocalSuccess),
            map(({ participant }) => this.createLocalPrimary(participant)),
            exhaustMap((stream) => {
                return this.conferenceRTService.addStream(stream).pipe(
                    map(() => ConferenceActions.addLocalPrimarySuccess({ stream })),
                    catchError((error) => {
                        const errorObj = {
                            stream,
                            error,
                        };
                        console.error('ADD_LOCAL_PRIMARY', errorObj);
                        return of(ConferenceActions.addLocalPrimaryError(errorObj));
                    }),
                );
            }),
        );
    });

    join$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.join),
                concatMap((id) => {
                    return this.store.select(selectIsConferenceConnected).pipe(
                        filter(Boolean),
                        map(() => id),
                        take(1),
                    );
                }),
                concatMap(({ id }) => {
                    return of(id).pipe(
                        withLatestFrom(this.store.select(selectLocalStream(id))),
                    );
                }),
                exhaustMap(([id, stream]) => {
                    if (!stream) {
                        return throwError(new LocalStreamNotFoundError(id));
                    }

                    if (stream.joined) {
                        return throwError(new LocalStreamAlreadyJoined(id));
                    }

                    return this.joinConference(stream).pipe(
                        map(() => ConferenceActions.joinSuccess({
                            id,
                        })),
                        catchError((error) => {
                            const errorObj = {
                                id,
                                error,
                            };
                            console.error('CONFERENCE_JOIN', stream, errorObj);
                            return of(ConferenceActions.joinError(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    joinError$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.joinError),
                concatMap((action) => {
                    return of(action).pipe(
                        withLatestFrom(this.store.select(selectLocalStream(action.id))),
                    );
                }),
                tap(([_, stream]) => {
                    this.deviceHistory.removeAudioDeviceId(stream.type);
                    this.deviceHistory.removeVideoDeviceId(stream.type);
                }),
            );
        },
        {
            dispatch: false,
        },
    );

    leave$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.leave),
                tap(({ id }) => {
                    this.conferenceService.leave(id);
                }),
            );
        },
        {
            dispatch: false,
        },
    );

    // after the MediaStream is created we set the stream device id info
    setDefaultMedia$ = createEffect(() => {
        return this.onLocalStreamJoined().pipe(
            map(({ id, audioSource, videoSource }) => {
                return ConferenceActions.setDefaultMedia({
                    id,
                    devices: {
                        audio: audioSource,
                        video: videoSource,
                    },
                });
            }),
        );
    });

    persistDefaultDevices$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.setDefaultMedia),
                concatMap((action) => {
                    return of(action).pipe(
                        withLatestFrom(this.store.select(selectLocalStream(action.id))),
                    );
                }),
                tap(([{ devices }, stream]) => {
                    const { audio, video } = devices;

                    if (video) {
                        this.deviceHistory.setVideoDeviceId(stream.type, video);
                    }

                    if (audio) {
                        this.deviceHistory.setAudioDeviceId(stream.type, audio);
                    }
                }),
            );
        },
        {
            dispatch: false,
        },
    );

    toggleRTVideo$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.hide, ConferenceActions.show),
                concatMap(({ id, type }) => {
                    const isHidden = type === ConferenceActionTypes.hide;
                    const successAction = isHidden ? ConferenceActions.hideSuccess : ConferenceActions.showSuccess;
                    const errorAction = isHidden ? ConferenceActions.hideError : ConferenceActions.showError;

                    return this.conferenceRTService.updateStream(id, {
                        video: {
                            isHidden,
                        },
                    }).pipe(
                        map(() => successAction({ id })),
                        catchError((error) => {
                            const errorObj = {
                                id,
                                error,
                            };
                            console.error('TOGGLE_VIDEO', errorObj);
                            return of(errorAction(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    toggleLocalVideo$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(
                    ConferenceActions.hideSuccess,
                    ConferenceActions.showSuccess,
                ),
                concatMap(({ id }) => {
                    return of(id).pipe(
                        withLatestFrom(this.store.select(selectStreamIsHidden(id))),
                    );
                }),
                switchMap(([id, isHidden]) => {
                    if (isHidden) {
                        this.conferenceService.hide(id);
                    } else {
                        this.conferenceService.show(id);
                    }
                    return EMPTY;
                }),
            );
        },
        {
            dispatch: false,
        },
    );

    toggleRTAudio$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.unmute, ConferenceActions.mute),
                concatMap(({ id, type }) => {
                    const isMuted = type === ConferenceActionTypes.mute;
                    const successAction = isMuted ? ConferenceActions.muteSuccess : ConferenceActions.unmuteSuccess;
                    const errorAction = isMuted ? ConferenceActions.muteError : ConferenceActions.unmuteError;

                    return this.conferenceRTService.updateStream(id, {
                        microphone: {
                            isMuted,
                        },
                    }).pipe(
                        map(() => successAction({ id })),
                        catchError((error) => {
                            const errorObj = {
                                id,
                                error,
                            };
                            console.error('TOGGLE_AUDIO', errorObj);
                            return of(errorAction(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    toggleLocalAudio$ = createEffect(
        () => {
            return this.store.select(selectHasLocalJoined).pipe(
                filter(Boolean),
                concatMap(() => {
                    return this.store.select(selectLocalPrimaryId);
                }),
                switchMap((id) => {
                    return this.store.select(selectStreamIsMuted(id)).pipe(
                        switchMap((isMuted) => {
                            if (isMuted) {
                                this.conferenceService.mute(id);
                            } else {
                                this.conferenceService.unmute(id);
                            }
                            return EMPTY;
                        }),
                    );
                }),
            );
        },
        {
            dispatch: false,
        },
    );

    setIsMutedRemotely$ = createEffect(
        () => {
            return this.onLocalStreamChangedFromRT().pipe(
                pluckDefinedWithId('microphone'),
                pluckDefinedWithId('isMuted'),
                map(([id, isMuted]) => ConferenceActions.setIsMutedRemotely({ id, isMuted })),
            );
        },
    );

    setAudioSource$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.setMicDevice),
                concatMap((action) => {
                    return of(action).pipe(
                        withLatestFrom(
                            this.store.select(
                                selectParticipantPrimaryStreamId(action.participantId),
                            ),
                        ),
                    );
                }),
                filter(([_, streamId]) => !!streamId),
                concatMap(([{ micDevice }, streamId]) => {
                    return this.conferenceService.setAudioSource(streamId, micDevice).pipe(
                        map(() => ConferenceActions.setMicDeviceSuccess({ streamId, micDevice })),
                        catchError((error) => {
                            const errorObj = {
                                streamId,
                                micDevice,
                                error,
                            };
                            console.error('SET_AUDIO_SOURCE', errorObj);
                            return of(ConferenceActions.setMicDeviceError(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    persistMicDevice$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.setMicDeviceSuccess),
                concatMap((action) => {
                    return of(action).pipe(
                        withLatestFrom(this.store.select(selectLocalStream(action.streamId))),
                    );
                }),
                tap(([{ micDevice }, stream]) => {
                    this.deviceHistory.setAudioDeviceId(stream.type, micDevice);
                }),
            );
        },
        {
            dispatch: false,
        },
    );

    setDisplayName$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.setDisplayName),
                concatMap(({ id, displayName }) => {
                    return this.conferenceRTService.updateStream(id, { displayName }).pipe(
                        map(() => ConferenceActions.setDisplayNameSuccess({ id, displayName })),
                        catchError((error) => {
                            const errorObj = {
                                id,
                                displayName,
                                error,
                            };
                            console.error('SET_DISPLAY_NAME', errorObj);
                            return of(ConferenceActions.setDisplayNameError(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    displayNameUpdatedRemotely$ = createEffect(
        () => {
            return this.onLocalStreamChangedFromRT().pipe(
                pluckDefinedWithId('displayName'),
                map(([id, displayName]) => ConferenceActions.setDisplayNameRemotely({ id, displayName })),
            );
        },
    );

    setVideoSource$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.setVideoDevice),
                concatMap(({ id, videoDevice }) => {
                    return this.conferenceService.setVideoSource(id, videoDevice).pipe(
                        map(() => ConferenceActions.setVideoDeviceSuccess({ id, videoDevice })),
                        catchError((error) => {
                            const errorObj = {
                                id,
                                videoDevice,
                                error,
                            };
                            console.error('SET_VIDEO_SOURCE', errorObj);
                            return of(ConferenceActions.setVideoDeviceError(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    persistVideoDevice$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.setVideoDeviceSuccess),
                concatMap((action) => {
                    return of(action).pipe(
                        withLatestFrom(this.store.select(selectLocalStream(action.id))),
                    );
                }),
                tap(([{ videoDevice }, stream]) => {
                    this.deviceHistory.setVideoDeviceId(stream.type, videoDevice);
                }),
            );
        },
        {
            dispatch: false,
        },
    );

    toggleRTIsPromoted$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.demote, ConferenceActions.promote),
                concatMap(({ id, type }) => {
                    const isPromoted = type === ConferenceActionTypes.promote;
                    const successAction = isPromoted
                        ? ConferenceActions.promoteSuccess
                        : ConferenceActions.demoteSuccess;
                    const errorAction = isPromoted ? ConferenceActions.promoteError : ConferenceActions.demoteError;

                    return this.conferenceRTService.updateStream(id, {
                        isPromoted,
                    }).pipe(
                        map(() => successAction({ id })),
                        catchError((error) => {
                            const errorObj = {
                                id,
                                error,
                            };
                            console.error('TOGGLE_IS_PROMOTED', errorObj);
                            return of(errorAction(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    isPromotedUpdatedRemotely$ = createEffect(
        () => {
            return this.onLocalStreamChangedFromRT().pipe(
                pluckDefinedWithId('isPromoted'),
                map(([id, isPromoted]) => ConferenceActions.setIsPromotedRemotely({ id, isPromoted })),
            );
        },
    );

    addLocalSecondary$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.addLocalSecondary),
                switchMap((action) => {
                    return of(action).pipe(
                        withLatestFrom(this.store.select(selectLocalParticipant)),
                    );
                }),
                exhaustMap(([{ videoDeviceId }, participant]) => {
                    const stream = this.createLocalSecondary(participant, videoDeviceId);
                    return this.conferenceRTService.addStream(stream).pipe(
                        map(() => ConferenceActions.addLocalSecondarySuccess({
                            stream,
                        })),
                        catchError((error) => {
                            const errorObj = {
                                stream,
                                error,
                            };
                            console.error('ADD_LOCAL_SECONDARY', errorObj);
                            return of(ConferenceActions.addLocalSecondaryError(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    removeLocalSecondary$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.removeLocalSecondary),
                switchMap((action) => {
                    return of(action).pipe(
                        withLatestFrom(
                            this.store.select(selectLocalSecondaryStreamId),
                        ),
                    );
                }),
                exhaustMap(([_, streamId]) => {
                    if (!streamId) {
                        throw new LocalSecondaryStreamNotFoundError();
                    }

                    return this.conferenceRTService.removeStream(streamId).pipe(
                        map(() => ConferenceActions.removeLocalSecondarySuccess({
                            id: streamId,
                        })),
                        catchError((error) => {
                            const errorObj = {
                                error,
                                id: streamId,
                            };
                            console.error('REMOVE_LOCAL_SECONDARY', errorObj);
                            return of(ConferenceActions.removeLocalSecondaryError(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    secondaryDeviceNotAvailable$ = createEffect(
        () => {
            return this.store.select(selectLocalSecondaryStreamId).pipe(
                switchMap((streamId) => {
                    if (!streamId) {
                        return EMPTY;
                    }
                    return this.store.select(selectIsStreamVideoDeviceAvailable(streamId)).pipe(
                        switchMap((isAvailable) => {
                            if (isAvailable) {
                                return EMPTY;
                            }

                            return of(ConferenceActions.removeLocalSecondary());
                        }),
                    );
                }),
            );
        },
    );

    toggleRTCovered$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.uncover, ConferenceActions.cover),
                concatMap(({ id, type }) => {
                    const isCovered = type === ConferenceActionTypes.cover;
                    const successAction = isCovered ? ConferenceActions.coverSuccess : ConferenceActions.uncoverSuccess;
                    const errorAction = isCovered ? ConferenceActions.coverError : ConferenceActions.uncoverError;

                    return this.conferenceRTService.updateStream(id, {
                        video: {
                            effects: {
                                isCovered,
                            },
                        },
                    }).pipe(
                        map(() => successAction({ id })),
                        catchError((error) => {
                            const errorObj = {
                                id,
                                error,
                            };
                            console.error('TOGGLE_IS_COVERED', errorObj);
                            return of(errorAction(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    isCoveredUpdatedRemotely$ = createEffect(
        () => {
            return this.onLocalStreamChangedFromRT().pipe(
                pluckDefinedWithId('video'),
                pluckDefinedWithId('effects'),
                pluckDefinedWithId('isCovered'),
                map(([id, isCovered]) => ConferenceActions.setIsCoveredRemotely({ id, isCovered })),
            );
        },
    );

    private createLocalSecondary(participant: Participant, videoDeviceId: string) {
        const type = StreamType.secondary;
        const newStream: LocalStream = {
            type,
            isLocal: true,
            id: `${participant.id}-${type}`,
            participantId: participant.id,
            displayName: `${participant.displayName} - Secondary Camera`,
            video: {
                isHidden: true,
                deviceId: videoDeviceId,
                effects: {
                    isCovered: false,
                    isMirrored: true,
                    isRotated: false,
                    isBackgroundBlurred: false,
                },
            },
        };
        return newStream;
    }

    private createLocalPrimary(participant: Participant) {
        const type = StreamType.primary;

        const newStream: LocalStream = {
            type,
            isLocal: true,
            id: `${participant.id}-${type}`,
            participantId: participant.id,
            displayName: participant.displayName,
            video: {
                isHidden: true,
                deviceId: this.deviceHistory.getVideoDeviceId(type),
                effects: {
                    isCovered: false,
                    isMirrored: true,
                    isRotated: false,
                    isBackgroundBlurred: false,
                },
            },
            microphone: {
                isMuted: participant.joinMuted,
                deviceId: this.deviceHistory.getAudioDeviceId(type),
            },
        };
        return newStream;
    }

    private joinConference(stream: LocalStream) {
        const { microphone, video, type } = stream;
        let audioSource = microphone ? this.resolveJoinSource(microphone.deviceId) : undefined;

        if (type === StreamType.secondary) {
            audioSource = false;
        }

        const videoSource = this.resolveJoinSource(video.deviceId);
        return this.conferenceService.join(
            stream.id,
            {
                audioSource,
                videoSource,
                isMuted: microphone ? microphone.isMuted : true,
                isHidden: video.isHidden,
            },
        );
    }

    private resolveJoinSource(source?: string) {
        if (typeof source === 'undefined' || source === null) {
            return true;
        }

        return source;
    }

    private onLocalStreamJoined() {
        return this.conferenceService.onJoined().pipe(
            concatMap((ev) => {
                return of(ev).pipe(
                    withLatestFrom(this.store.select(selectLocalStream(ev.id))),
                );
            }),
            filter(([_, stream]) => !!stream),
            map(([ev]) => ev),
        );
    }

    private onLocalStreamChangedFromRT() {
        return this.store.pipe(
            selectSessionReady,
            switchMap(() => {
                return this.conferenceRTService.onStreamChanged().pipe(
                    concatMap((changes) => {
                        return of(changes).pipe(
                            withLatestFrom(this.store.select(selectLocalStream(changes.id))),
                        );
                    }),
                    filter(([_, stream]) => !!stream),
                    map(([changes]) => [changes.id, changes] as PluckDefinedResult<typeof changes>),
                );
            }),
        );
    }

    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private conferenceRTService: ConferenceRTService,
        private conferenceService: ConferenceService,
        private deviceHistory: DevicesHistoryService,
        private devicesService: DevicesService,
    ) {
    }

}

class LocalStreamNotFoundError extends Error {
    constructor(public id: string) {
        super(`Local Stream with id ${id} not found`);
    }
}

class LocalStreamAlreadyJoined extends Error {
    constructor(public id: string) {
        super(`Local Stream with id ${id} is joined already`);
    }
}

class LocalSecondaryStreamNotFoundError extends Error {
    constructor() {
        super(`Local Secondary Stream not found`);
    }
}
