import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { concatMap, map, switchMap, filter, withLatestFrom, exhaustMap, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { AppState } from '@app/store';
import { selectSessionReady, SessionActions, selectLocalParticipantId } from '@room/session/store';
import { ConferenceRTService } from '../conference-rt.service';
import { ConferenceActions } from './conference.actions';
import { selectParticipantStreams, selectParticipantStreamsIds, selectRemoteStream, selectStreamParticipantId } from './conference.selectors';
import { ConferenceService } from '../conference.service';

@Injectable()
export class ConferenceRemoteStreamsEffects {

    remoteStreamAdded$ = createEffect(
        () => {
            return this.onRemoteStreamAdded().pipe(
                map(stream => ConferenceActions.addRemote({
                    stream: { isLocal: false , ...stream },
                })),
            );
        },
    );

    remoteStreamChanged$ = createEffect(
        () => {
            return this.onRemoteStreamChanged().pipe(
                map(
                    ({ id, ...stream }) => ConferenceActions.updateRemote({ id, stream }),
                ),
            );
        },
    );

    remoteStreamRemoved$ = createEffect(
        () => {
            return this.onRemoteStreamRemoved().pipe(
                map(
                    id => ConferenceActions.removeRemote({ id }),
                ),
            );
        },
    );

    dismiss$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.dismiss),
                exhaustMap(({ id }) => {
                    return of(id).pipe(
                        withLatestFrom(this.store.select(selectStreamParticipantId(id))),
                    ).pipe(
                        map(([_, participantId]) => SessionActions.kick({
                            id: participantId,
                        })),
                    );
                }),
            );
        },
    );

    kicked$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SessionActions.kick),
                concatMap(({ id }) => {
                    return of(id).pipe(
                        withLatestFrom(this.store.select(selectParticipantStreamsIds(id))),
                    );
                }),
                mergeMap(([, streamIds]) => {
                    return forkJoin(streamIds.map(id => this.conferenceService.forceDisconnect(id)));
                }),
            );
        },
        {
            dispatch: false,
        },
    );

    private onRemoteStreamAdded() {
        return this.store.pipe(
            selectSessionReady,
            switchMap(() => {
                return this.conferenceRTService.onStreamAdded().pipe(
                    concatMap((stream) => {
                        return of(stream).pipe(
                            withLatestFrom(this.store.select(selectLocalParticipantId)),
                        );
                    }),
                    filter(([stream, localParticipantId]) => stream.participantId !== localParticipantId),
                    map(([stream]) => stream),
                );
            }),
        );
    }

    private onRemoteStreamChanged() {
        return this.store.pipe(
            selectSessionReady,
            switchMap(() => {
                return this.conferenceRTService.onStreamChanged().pipe(
                    concatMap((changes) => {
                        return of(changes).pipe(
                            withLatestFrom(this.store.select(selectRemoteStream(changes.id))),
                        );
                    }),
                    filter(([_, stream]) => !!stream),
                    map(([changes]) => changes),
                );
            }),
        );
    }

    private onRemoteStreamRemoved() {
        return this.store.pipe(
            selectSessionReady,
            switchMap(() => {
                return this.conferenceRTService.onStreamRemoved().pipe(
                    concatMap((id) => {
                        return of(id).pipe(
                            withLatestFrom(this.store.select(selectRemoteStream(id))),
                        );
                    }),
                    filter(([_, stream]) => !!stream),
                    map(([id]) => id),
                );
            }),
        );
    }

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private conferenceRTService: ConferenceRTService,
        private conferenceService: ConferenceService,
    ) {
    }

}
