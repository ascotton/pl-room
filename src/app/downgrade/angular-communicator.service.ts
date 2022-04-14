// As we build more ng2 components, if they need to communicate to ng1 directives or code, I am
// unaware of a way to use the standard methods like @Output to talk to parent components or using
// ngrx store for broadcasting events. Thus, this is an intermediary service that is basically a
// property library for triggering things, generally from angular 2 to angular 1.

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppStore } from '@app/appstore.model';
import { FirebaseService } from '../common/firebase/firebase.service';
import { SessionState } from '../modules/room/session/store';

@Injectable()
export class AngularCommunicatorService {
    roomname = '';
    firebaseApps = {};
    activeQueueId = '';
    activeQueueName = '';
    queueAddDone = true;
    activeActivity = null;
    personas = {
        local: [],
        remote: [],
    };
    goFishData: any = {
        forceResize: 0,
    };
    sessionStore: Store<SessionState>;
    constructor(
        private store: Store<AppStore>,
        private firebaseService: FirebaseService,
    ) {
        store.select('gameGoFish')
            .subscribe((data: any) => {
                if (data.forceResize !== undefined) {
                    this.goFishData.forceResize = data.forceResize;
                }
            });
    }

    getFirebaseRef(name) {
        return this.firebaseService.getRoomRef(name);
        /* let ref = null;
        if (this.roomname) {
            const path = `${this.roomname}/${name}`;
            ref = firebase.database().ref(path);
        }
        return ref; */
    }

    getFirebaseRefByName(appName, path) {
        return firebase.database(this.firebaseApps[appName]).ref(path);
    }

    updateFirebaseRef(updateVals, name = 'app') {
        const ref = this.getFirebaseRef(name);
        ref.update(updateVals);
    }

    updatePersonas(personas, type) {
        if (!personas.length) {
            this.personas[type] = [];
        } else {
            const keys = ['guid', 'name', 'state', 'userGroups'];
            const personas1 = [];
            personas.forEach((persona) => {
                if (!persona.secondary && !persona.screenshare) {
                    let persona1 = {};
                    keys.forEach((key) => {
                        persona1[key] = persona[key];
                    });
                    personas1.push(persona1);
                }
            });
            this.personas[type] = personas1;
        }
        this.store.dispatch({ type: 'UPDATE_PERSONAS', payload: { personas: this.personas } });
    }

    onWorkspaceDrawerChange() {
        this.store.dispatch({ type: 'UPDATE_GAME_GO_FISH',
            payload: { forceResize: (this.goFishData.forceResize + 1) } });
    }

    onWorkspaceWhiteboardChange() {
        this.store.dispatch({ type: 'UPDATE_GAME_GO_FISH',
            payload: { forceResize: (this.goFishData.forceResize + 1) } });
    }

    updateTokboxConnected(connected) {
        this.store.dispatch({ type: 'UPDATE_TOKBOX', payload: { connected } });
    }
}
