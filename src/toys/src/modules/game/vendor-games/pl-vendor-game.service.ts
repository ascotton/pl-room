// tslint:disable

import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { switchMap, concatMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AngularCommunicatorService } from '@app/downgrade/angular-communicator.service';
import { AppState } from '@app/store';
import { PLVendorGamesByActivity } from './pl-vendor-game-definitions.service';
import { selectSessionReady, selectActiveParticipants, selectLocalParticipantId, Participant, ParticipantType } from '@room/session/store';


// SE NOTE: Added these types for clarity sake
interface PLGameDbRefValueCallback { (value:any):void; }
interface PLGameDbRefValueListener {
	/** The function actually listening on the fb reference. */
	listener:{ (snapshot:any):void; },
	/** The game callback function to make within listener, it should be passed snapshot.val() as a param. */
	callback:PLGameDbRefValueCallback
}

interface PLGameDbRef {
    plGameDbAPI: PLGameDbAPI,
    valueListeners: PLGameDbRefValueListener[], // SE NOTE: Renamed to valueListeners for clarity and added map type
}

export interface PLGameDb {
    ref: (path: string) => PLGameDbAPI,
}
export interface PLGameDbAPI {
    path: string,
    isDisposed: boolean,

    get: Function,
    set: Function,
    onValue: Function,
    offValue: Function,
    dispose: Function,
}

export interface PLGameAdapterUrlParams {
    isRoomOwner: 0 | 1,
    clientId: string,
}

export interface PLVendorGame {
    vendor: string,
    name: string,
    setConfig: (plGameDb: PLGameDb, gameConfig: PLGameConfig) => void,
    getIframeUrl: (params: PLGameAdapterUrlParams) => string,
    newFormData: () => any,
}

export interface PLGameConfig {}

const PL_GAME_DB = 'PLGameDb';

@Injectable()
export class PLVendorGameService {
    private version = '1.0.0';
    private firebaseRef: any;
    private plRefs: PLGameDbRef[] = [];

    constructor(
        private store: Store<AppState>,
        private domSanitizer: DomSanitizer,
        private angularCommunicator: AngularCommunicatorService,
    ) { }

    setupPLGameDb(activity): PLGameDb {
        if (window[PL_GAME_DB]) return window[PL_GAME_DB];

        this.initFirebase(activity);
        return window[PL_GAME_DB] = {
            ref: (path: string): PLGameDbAPI => {
                return this.getGameDbPlRef(path).plGameDbAPI;
            }
        };
    }

    sanitizeUrl(url: string): any {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    }

    isVendorGame(activity: any) {
        return PLVendorGamesByActivity[activity.type];
    }

    getParticipantsAndLocalId() {
        return this.store.pipe(
            selectSessionReady,
            switchMap(() => {
                return this.store.select(selectActiveParticipants).pipe(
                    concatMap((participants) => {
                        return of(participants).pipe(
                            withLatestFrom(this.store.select(selectLocalParticipantId)),
                        );
                    }),
                );
            })
        );
    }

    // produce a unique list of participants
    getPlayerOpts(participants: Participant[]) {
        const hostParticipant =  participants.find(p => p.type === ParticipantType.host);
        const otherParticipants = participants.filter(p => p.type !== ParticipantType.host);
        if (hostParticipant) {
            const opts = otherParticipants.map((p) => {
                return { label: p.displayName, value: p.id };
            });
            const sorted = opts.sort((a, b) => a.label.localeCompare(b.label));
            const { displayName, id } = hostParticipant;
            return [{ label: displayName, value: id }, ...sorted];
        }
    }

    destroyGameDb() {
        while (this.plRefs.length > 0) {
            this.plRefs[0].plGameDbAPI.dispose();
        }
        delete window['PLGameDb'];
    }

    private getGameDbPlRef(path: string) {
        const fbRef = this.firebaseRef.child(path);
        const plRef: PLGameDbRef = {
            plGameDbAPI: {
                path,
                isDisposed: false,
                get: (success, failure) => {
                    const listener = (snapshot) => success(snapshot.val());
                    fbRef.once('value').then(listener).catch(failure);
                },
                set: (value, success, failure) => {
                    fbRef.set(value).then(success).catch(failure);
                },
                onValue: (callback) => {
                    const valueListener = {
                        callback,
                        listener: (snapshot) => { callback(snapshot.val()); }
                    };
					plRef.valueListeners.push(valueListener); //plRef.listeners[callback] = valueListener; // SE NOTE: changed this line to use push
                    return fbRef.on('value', valueListener.listener);
                },
                offValue: (callback?) => {
                    if (callback) {
						// SE NOTE: going to change this quite a bit so i am just commenting out the next 2 lines and rewriting it below that
                        //const valueListener = plRef.listeners[callback];
                        //fbRef.off('value', valueListener);

						// We want to remove the 1st instance of a valueListener with the supplied callback
						for (let i = 0; i < plRef.valueListeners.length; ++i)
						{
							if (plRef.valueListeners[i].callback === callback)
							{
								fbRef.off('value', plRef.valueListeners[i].listener);	// NOTE: remove the 'listener' property here because thats what is attached in fbRef.on
								plRef.valueListeners.splice(i, 1);						// remove it from the list since its no longer active
								return;
							}
						}
                    } else {
						// SE NOTE: going to change this quite a bit so i am just commenting out the next line and rewriting it below that
                        //fbRef.off('value');

						// We want to remove all valueListeners, but because of how firebase reference's off function works, we MUST supply the callback to remove
						// So while there are still value listeners remaining, just remove them one at a time
						while (plRef.valueListeners.length > 0) plRef.plGameDbAPI.offValue(plRef.valueListeners[0].callback);
                    }
                },
                dispose: () => {
                    const gameDb = plRef.plGameDbAPI;
                    if (gameDb.isDisposed) return;
                    gameDb.isDisposed = true;

                    // call off() to remove all listener
                    gameDb.offValue();

                    // remove from plRefs
                    this.plRefs.splice(this.plRefs.indexOf(plRef), 1);

                },
            },
            valueListeners: [],	// SE NOTE: updated from listeners to valueListeners for name change mentioned above
        }
        this.plRefs.push(plRef);

        if (Object.keys(this.plRefs).length === 1) {
            console.log(`=== PLGameDb Service\nversion ${this.version}`);
        }
        return plRef;
    }

    private initFirebase(activity) {
        const fbPath = `activities/queues/items/${activity.queueId}/items/${activity.activityId}`;
        this.firebaseRef = this.angularCommunicator.getFirebaseRef(fbPath);
    }
}
