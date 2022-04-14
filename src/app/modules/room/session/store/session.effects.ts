import { Injectable } from '@angular/core';
import { of, fromEvent, EMPTY, timer } from 'rxjs';
import { map, switchMap, take, concatMap, catchError, filter, withLatestFrom, mergeMap, exhaustMap } from 'rxjs/operators';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectIsFirebaseConnected } from '@common/firebase/store';
import { User } from '@modules/user/user.model';
import { selectCurrentUser, selectUserId } from '@modules/user/store';
import { selectIsRoomReady } from '@room/store/room.selector';
import { SessionService } from '../session.service';
import { SessionActions, SessionActionTypes } from './session.actions';
import { ParticipantStatus, Participant, ParticipantType } from './session.model';
import {
    selectSessionInitialized,
    selectLocalParticipantId,
    selectRemoteParticipant,
    selectIsParticipantOffline,
    selectIsHostAbsent,
    selectIsParticipantEntering,
    selectLocalParticipantType,
    selectParticipantIsGuest,
    selectParticipantIsHost,
    selectIsLocalParticipantGuest,
} from './session.selectors';
import { GuidService } from '@common/services/GuidService';
import { PLUrlsService } from '@root/src/lib-components';

@Injectable()
export class SessionEffects {
    initialize$ = createEffect(
        () => {
            return this.store.pipe(
                selectIsRoomReady,
                switchMap(() =>
                    this.store.select(selectCurrentUser).pipe(take(1)),
                ),
                map(user => this.createLocalParticipant(user)),
                map((participant) => {
                    if (participant.type === ParticipantType.observer) {
                        return SessionActions.initObserver({ participant });
                    }

                    return SessionActions.addLocal({ participant });
                }),
            );
        },
    );

    addLocal$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SessionActions.addLocal),
                switchMap(({ participant }) => {
                    return this.sessionService.addParticipant(participant).pipe(
                        map(() => SessionActions.addLocalSuccess({ participant })),
                        catchError((error) => {
                            const errObj = {
                                participant,
                                error,
                            };
                            console.error('ADD_LOCAL_PARTICIPANT', errObj);
                            return of(SessionActions.addLocalError(errObj));
                        }),
                    );
                }),
            );
        },
    );

    checkIfViewingPage$ = createEffect(
        () => {
            return this.onIsDocumentVisibleChanged().pipe(
                map((isDocumentVisible) => {
                    return SessionActions.setIsViewingPage({
                        isViewingPage: isDocumentVisible,
                    });
                }),
            );
        },
    );

    setIsViewingPage$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SessionActions.setIsViewingPage),
                switchMap((action) => {
                    return of(action).pipe(
                        withLatestFrom(
                            this.store.select(selectLocalParticipantId),
                        ),
                    );
                }),
                concatMap((result) => {
                    const [_, participantId] = result;
                    return of(result).pipe(
                        withLatestFrom(this.sessionService.hasParticipant(participantId)),
                    );
                }),
                filter(([_, hasParticipant]) => hasParticipant),
                map(([result]) => result),
                switchMap(([{ isViewingPage }, participantId]) => {
                    return this.sessionService.updateParticipant(
                        participantId,
                        { isViewingPage },
                    ).pipe(
                        map(() => SessionActions.setIsViewingPageSuccess({
                            isViewingPage,
                            id: participantId,
                        })),
                        catchError((error) => {
                            const errObj = {
                                isViewingPage,
                                error,
                            };
                            console.error('SET_VIEWING_PAGE', errObj);
                            return of(SessionActions.setIsViewingPageError(errObj));
                        }),
                    );
                }),
            );
        },
    );

    addedRemotely$ = createEffect(
        () => {
            return this.onRemoteAdded().pipe(
                map(participant => SessionActions.addedRemotely({ participant: { isLocal: false, ...participant } })),
            );
        },
    );

    updatedRemotely$ = createEffect(
        () => {
            return this.onRemoteChanged().pipe(
                map(({ id, ...participant }) => SessionActions.updatedRemotely({ id, participant })),
            );
        },
    );

    removedRemotely$ = createEffect(
        () => {
            return this.onRemoteRemoved().pipe(
                map(id => SessionActions.removedRemotely({ id })),
            );
        },
    );

    addWaiting$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SessionActions.addWaiting),
                switchMap(({ participant }) => {
                    return this.sessionService.addParticipant(participant).pipe(
                        map(() => SessionActions.addWaitingSuccess({ participant })),
                        catchError((error) => {
                            const errObj = {
                                participant,
                                error,
                            };
                            console.error('ADD_WAITING_PARTICIPANT', errObj);
                            return of(SessionActions.addWaitingError(errObj));
                        }),
                    );
                }),
            );
        },
    );

    admit$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SessionActions.admit),
                switchMap(({ id }) => {
                    return this.sessionService.updateParticipant(id, { status: ParticipantStatus.entering }).pipe(
                        map(() => SessionActions.admitSuccess({ id })),
                        catchError((error) => {
                            const errObj = {
                                id,
                                error,
                            };
                            console.error('ADMIT', errObj);
                            return of(SessionActions.admitError(errObj));
                        }),
                    );
                }),
            );
        },
    );

    waitForGuestToJoin$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SessionActions.admitSuccess),
                mergeMap(({ id }) => {
                    return this.store.select(selectIsParticipantEntering(id)).pipe(
                        switchMap((isEntering) => {
                            if (!isEntering) {
                                return EMPTY;
                            }
                            const delay = 20_000;
                            return timer(delay).pipe(
                                map(() => SessionActions.studentAdmissionFailed({ id })),
                            );
                        }),
                    );
                }),
            );
        },
    );

    studentAdmissionFailed$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SessionActions.studentAdmissionFailed),
                mergeMap(({ id }) => {
                    return this.sessionService.updateParticipant(
                        id,
                        { status: ParticipantStatus.enteringTimeout },
                    ).pipe(
                        map(() => SessionActions.studentAdmissionFailedSetSuccess({ id })),
                        catchError((error) => {
                            const errObj = {
                                id,
                                error,
                            };
                            console.error('studentAdmissionFailed', errObj);
                            return of(SessionActions.studentAdmissionFailedSetError(errObj));
                        }),
                    );
                }),
            );
        },
    );

    kick$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(
                    SessionActions.kick,
                ),
                mergeMap(({ id }) => {
                    return this.sessionService.removeParticipant(id).pipe(
                        map(() => SessionActions.kickSuccess({ id })),
                        catchError((error) => {
                            const errObj = {
                                id,
                                error,
                            };
                            console.error('KICK_PARTICIPANT', errObj);
                            return of(SessionActions.kickError(errObj));
                        }),
                    );
                }),
            );
        },
    );

    kicked$ = createEffect(
        () => {
            return this.onLocalRemoved().pipe(
                // TODO there is some code in app-global component listening to this action
                // we need to move that code into the effects file
                concatMap(id => this.store.select(selectParticipantIsGuest(id)).pipe(
                    take(1),
                )),
                filter(isGuest => isGuest),
                map(() => SessionActions.kicked()),
            );
        },
    );

    hostKicked$ = createEffect(
        () => {
            return this.onLocalRemoved().pipe(
                concatMap(id => this.store.select(selectParticipantIsHost(id)).pipe(
                    take(1),
                )),
                filter(isHost => isHost),
                switchMap(() => {
                    window.location.href = this.plUrls.urls.landingFE;
                    return EMPTY;
                }),
            );
        },
        {
            dispatch: false,
        },
    );

    setLocalOffline$ = createEffect(
        () => {
            return this.onLocalConnectedToRTChanged().pipe(
                map(([isConnected, localId]) => SessionActions.setLocalOffline({ id: localId, offline: !isConnected })),
            );
        },
    );

    lostConnection$ = createEffect(
        () => {
            return this.onLocalConnectedToRT().pipe(
                switchMap(id =>  this.handleParticipantOffline(id)),
            );
        },
        {
            dispatch: false,
        },
    );

    leaveOnLostConnection$ = createEffect(() => {
        return this.onLocalConnectedToRTChanged().pipe(
            concatMap(([isConnected]) => {
                return of(isConnected).pipe(
                    withLatestFrom(this.store.select(selectIsLocalParticipantGuest)),
                );
            }),
            filter(([_, isGuest]) => isGuest),
            switchMap(([isConnected]) => {
                if (isConnected) {
                    return EMPTY;
                }

                return timer(10_000).pipe(
                    map(() => SessionActions.leave()),
                );
            }),
        );
    });

    cleanupOffline$ = createEffect(
        () => {
            return this.onParticipantOffline().pipe(
                switchMap((participantId) => {
                    return this.store.select(selectIsParticipantOffline(participantId)).pipe(
                        switchMap((isOffline) => {
                            if (!isOffline) {
                                return EMPTY;
                            }

                            return this.removeLongDisconnected(participantId).pipe(
                                map(() => SessionActions.removeOfflineSuccess({ id: participantId })),
                                catchError((error) => {
                                    const errObj = {
                                        error,
                                        id: participantId,
                                    };
                                    console.error('REMOVE_OFFLINE_PARTICIPANT', errObj);
                                    return of(SessionActions.removeOfflineError(errObj));
                                }),
                            );
                        }),
                    );
                }),

            );
        },
    );

    setYoutubePendingInteraction$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SessionActions.setYoutubeInteractionPending),
                concatMap(({ isPending }) => {
                    return of(isPending).pipe(
                        withLatestFrom(this.store.select(selectLocalParticipantId)),
                    );
                }),
                concatMap(([isPending, id]) => {
                    return this.sessionService.updateParticipant(id, { isYoutubeInteractionPending: isPending }).pipe(
                        map(() => SessionActions.setYoutubeInteractionPendingSuccess({ id, isPending })),
                        catchError((error) => {
                            const errObj = {
                                error,
                                isPending,
                            };
                            return of(SessionActions.setYoutubeInteractionPendingError(errObj));
                        }),
                    );
                }),
            );
        },
    );

    providerLeft$ = createEffect(
        () => {
            return this.onSessionReady().pipe(
                switchMap(() => {
                    return this.store.select(selectIsHostAbsent).pipe(
                        switchMap((isOffline) => {
                            if (!isOffline) {
                                return EMPTY;
                            }

                            const delay = 5 * 60_000;
                            return timer(delay).pipe(
                                map(() => SessionActions.leave()),
                            );
                        }),
                    );
                }),
            );
        },
    );

    leave$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SessionActions.leave),
                exhaustMap(() => {
                    return this.store.select(selectLocalParticipantId).pipe(
                        take(1),
                        map(id => SessionActions.kick({ id })),
                    );
                }),
            );
        },
    );

    onLeavePage$ = createEffect(
        () => {
            return this.onLeavePage().pipe(
                map(() => SessionActions.leave()),
            );
        },
    );

    kickDuplicateds$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SessionActions.kickDuplicateds),
                exhaustMap(() => {
                    return this.getDuplicatedHosts().pipe(
                        switchMap((duplicateds) => {
                            const ids = duplicateds.map(p => p.id);
                            return this.sessionService.removeMultipleParticipants(ids).pipe(
                                map(() => SessionActions.kickDuplicatedsSuccess()),
                                catchError((error) => {
                                    console.error(error);
                                    return of(SessionActions.kickDuplicatedsError({ error }));
                                }),
                            );
                        }),
                    );
                }),
            );
        },
    );

    private getDuplicatedHosts() {
        return this.store.select(selectUserId).pipe(
            take(1),
            mergeMap((userId) => {
                return this.sessionService.getParticipantsByUserId(userId);
            }),
        );
    }

    private createLocalParticipant(user: User) {
        const type = this.sessionService.getUserParticipantType(user);

        const { admissionInfo } = user;
        const { joinMuted = type === ParticipantType.host } = admissionInfo || {};
        const id = type === ParticipantType.host ? new GuidService().generateUUID() : user.uuid;

        const newParticipant: Participant = {
            id,
            type,
            joinMuted,
            isLocal: true,
            userId: user.uuid,
            status: ParticipantStatus.joined,
            displayName: user.display_name,
            isIPad: window.roomGlobal.isIPadSafari || false,
            isViewingPage: true,
            isYoutubeInteractionPending: window.roomGlobal.showingYoutubeLootBox || false,
            omitFromSessionRecord: false,
        };

        return newParticipant;
    }

    private onLeavePage() {
        const evName = window.roomGlobal.isIPadSafari ? 'pagehide' : 'beforeunload';
        return this.onSessionReady().pipe(
            switchMap(() => {
                return fromEvent(window, evName);
            }),
        );
    }

    private onSessionReady() {
        return this.store.select(selectSessionInitialized).pipe(
            filter(Boolean),
        );
    }

    private onHostSessionReady() {
        return this.onSessionReady().pipe(
            switchMap(() => {
                return this.store.select(selectLocalParticipantType).pipe(
                    take(1),
                );
            }),
            filter(type => type === ParticipantType.host),
        );
    }

    private onIsDocumentVisibleChanged() {
        return this.onSessionReady().pipe(
            switchMap(() => {
                return fromEvent(document, 'visibilitychange').pipe(
                    map(() => document.visibilityState === 'visible'),
                );
            }),
        );
    }

    private onRemoteAdded() {
        return this.onSessionReady().pipe(
            switchMap(() => {
                return this.sessionService.onParticipantAdded().pipe(
                    mergeMap((participant) => {
                        return of(participant).pipe(
                            withLatestFrom(this.store.select(selectLocalParticipantId)),
                        );
                    }),
                    filter(([participant, localId]) => participant.id !== localId),
                    map(([participant]) => participant),
                );
            }),
        );
    }

    private onRemoteChanged() {
        return this.onSessionReady().pipe(
            switchMap(() => {
                return this.sessionService.onParticipantChanged().pipe(
                    concatMap((changes) => {
                        return of(changes).pipe(
                            withLatestFrom(this.store.select(selectRemoteParticipant(changes.id))),
                        );
                    }),
                    filter(([_, participant]) => !!participant),
                    map(([changes]) => changes),
                );
            }),
        );
    }

    private onRemoteRemoved() {
        return this.onSessionReady().pipe(
            switchMap(() => {
                return this.sessionService.onParticipantRemoved().pipe(
                    concatMap((id) => {
                        return of(id).pipe(
                            withLatestFrom(this.store.select(selectRemoteParticipant(id))),
                        );
                    }),
                    filter(([_, participant]) => !!participant),
                    map(([id]) => id),
                );
            }),
        );
    }

    private onLocalRemoved() {
        return this.onSessionReady().pipe(
            switchMap(() => {
                return this.store.select(selectLocalParticipantId).pipe(
                    switchMap((id) => {
                        return this.sessionService.hasParticipant(id).pipe(
                            filter(hasParticipant => !hasParticipant),
                            map(() => id),
                        );
                    }),
                );
            }),
        );
    }

    private onLocalConnectedToRT() {
        return this.onLocalConnectedToRTChanged().pipe(
            filter(([isConnected]) => isConnected),
            map(([_, participantId]) => participantId),
        );
    }

    private onLocalConnectedToRTChanged() {
        return this.onSessionReady().pipe(
            switchMap(() => {
                return this.store.select(selectIsFirebaseConnected).pipe(
                    concatMap((isConnected) => {
                        return of(isConnected).pipe(
                            withLatestFrom(this.store.select(selectLocalParticipantId)),
                        );
                    }),
                );
            }),
        );
    }

    private handleParticipantOffline(participantId: string) {
        return this.sessionService.updateParticipant(
            participantId,
            {
                offline: null,
                offlineAt: null,
            },
        ).pipe(
            switchMap(() => {
                return this.sessionService.hasParticipant(participantId);
            }),
            switchMap((hasParticipant) => {
                const disconnectedRef = this.sessionService.createDisconnectedRef(participantId);

                if (!hasParticipant) {
                    return disconnectedRef.cancel();
                }

                return disconnectedRef.cancel().pipe(
                    switchMap(() => disconnectedRef.update({
                        offline: true,
                        offlineAt: firebase.database.ServerValue.TIMESTAMP,
                    })),
                );
            }),
        );
    }

    private onParticipantOffline() {
        return this.onHostSessionReady().pipe(
            switchMap(() => {
                return this.actions$.pipe(
                    ofType(
                        SessionActions.addedRemotely,
                        SessionActions.updatedRemotely,
                    ),
                    filter(({ participant }) => participant.offline),
                    map((action) => {
                        if (action.type === SessionActionTypes.updatedRemotely) {
                            return action.id;
                        }
                        return action.participant.id;
                    }),
                );
            }),
        );
    }

    private removeLongDisconnected(participantId: string) {
        const delay = 60_000;
        return timer(delay).pipe(
            switchMap(() => this.sessionService.removeParticipant(participantId)),
        );
    }

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private sessionService: SessionService,
        private plUrls: PLUrlsService,
    ) {}
}
