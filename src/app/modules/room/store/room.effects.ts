import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { RoomActions } from './room.actions';
import { FirebaseActions } from '@common/firebase/store';
import { AngularCommunicatorService } from '@app/downgrade/angular-communicator.service';

@Injectable()
export class RoomEffects {
    initializeFirebase$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(RoomActions.setSuccess),
                tap(({ data }) => {
                    // TODO: remove this once we get rid of using this service
                    // to get firebase refs
                    this.angularCommunicatorService.roomname = data.name;
                }),
                map(({ data }) => {
                    const {
                        name,
                        firebase_app_config,
                        firebase_baseurl,
                        firebase_auth_token,
                    } = data;

                    return {
                        roomName: name,
                        customToken: firebase_auth_token,
                        apiKey: firebase_app_config.apiKey,
                        authDomain: firebase_app_config.authDomain,
                        databaseURL: firebase_baseurl,
                        storageBucket: firebase_app_config.storageBucket,
                        messagingSenderId:
                            firebase_app_config.messagingSenderId,
                    };
                }),
                map(config => FirebaseActions.initialize({ config })),
            );
        },
    );

    constructor(
        private actions$: Actions,
        private angularCommunicatorService: AngularCommunicatorService,
    ) { }
}
