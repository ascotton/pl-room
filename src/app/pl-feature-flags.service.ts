import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { environment } from '../environments/environment';

import { AngularCommunicatorService } from
    './downgrade/angular-communicator.service';

import { AppStore } from './appstore.model';
// import { User } from './modules/user/user.model';

@Injectable()
export class PLFeatureFlagsService {
    ready: boolean = false;
    // currentUser: User;

    featureFlags: any = environment.feature_flags || {};

    constructor(private store: Store<AppStore>,
        private angularCommunicator: AngularCommunicatorService) {
        // store.select('currentUser')
        //     .subscribe((user: any) => {
        //         console.log('user', user);
        //         this.currentUser = user;
        //         if (this.currentUser && this.currentUser.uuid) {
        //             this.ready = true;
        //         }
        //     });
        this.ready = true;
    }

    saveFlagsToFirebase() {
        const ref = this.angularCommunicator.getFirebaseRef('featureFlags');
        if (ref) {
            const flags = {
                sharedCursorTokbox: this.getSharedCursorTokbox(),
            };
            ref.update(flags);
        }
    }

    waitForReady(callback) {
        if (!this.ready) {
            setTimeout(() => {
                this.waitForReady(callback);
            }, 250);
        } else {
            callback();
        }
    }

    getFlag(key) {
        return key in this.featureFlags ? this.featureFlags[key] : 0;
    }

    getIdCharactersByRatio(ratio, allCharacters='abcdefghijklmnopqrstuvwxyz0123456789') {
        return allCharacters.slice(0, Math.floor(allCharacters.length * ratio));
    }

    filterById(id, startingCharacters='abcdefg') {
        return startingCharacters.includes(id[0].toLowerCase()) ? true : false;
    }

    filterIdsByRatio(id, ratio) {
        const characters = this.getIdCharactersByRatio(ratio)
        return this.filterById(id, characters);
    }

    getSharedCursorTokbox() {
        // return this.filterIdsByRatio(this.currentUser.uuid, this.getFlag('sharedCursorTokbox')) ? 'tokbox' : 'firebase';
        return this.filterIdsByRatio(this.angularCommunicator.roomname,
            this.getFlag('sharedCursorTokbox')) ? 'tokbox' : 'firebase';
    }
}
