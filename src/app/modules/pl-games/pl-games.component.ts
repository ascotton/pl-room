import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '@root/src/app/store';
import { AngularCommunicatorService } from
    '@app/downgrade/angular-communicator.service';

@Component({
    selector: 'pl-games',
    templateUrl: './pl-games.component.html',
    styleUrls: ['./pl-games.component.less'],
})
export class PlGamesComponent implements OnInit {
    subscription: Subscription;
    active = false;
    boardGamesActive = false;
    firebaseRef: any;
    gameMessage = 'Games';

    constructor(
        public angularCommunicator: AngularCommunicatorService,
        private store: Store<AppState>,
        ) {
    }

    ngOnInit(): void {
        this.initFirebase();
        this.initStore();
    }

    initFirebase() {
        this.firebaseRef = this.angularCommunicator.getFirebaseRef('games');
    }

    initStore(): void {
        this.firebaseRef.child('boardGamesActive').on('value', (snap) => {
            this.boardGamesActive = snap.val();
        });

        this.store.select('firebaseStateStore').subscribe(
            (data: any) => {
                if (!data) {
                    return;
                }
                const type = data.type;
                const payload = data.payload;
                switch (type) {
                        case 'FIREBASE_UPDATE':
                            this.active = payload.gamesActive;
                            return;
                }
            },
        );
    }
}
