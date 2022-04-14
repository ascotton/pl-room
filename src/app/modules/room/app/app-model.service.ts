import { Injectable } from '@angular/core';
import { FirebaseService } from '@common/firebase/firebase.service';
import { FirebaseRef } from '@root/src/app/common/firebase/firebase-ref';
import { map } from 'rxjs/operators';
import { StreamLike } from '../conference/store';
import { AppConfigState, LayoutMode } from './store';

@Injectable({ providedIn: 'root' })
export class AppModelService {
    private appRef: FirebaseRef;

    constructor(firebaseService: FirebaseService) {
        this.appRef = new FirebaseRef(
            firebaseService.getLazyRoomRef('app'),
        );
    }

    onChanged() {
        return this.appRef.valueChanges.pipe(
            map(snap => snap.val() as AppConfigState),
        );
    }

    update(data: any) {
        return this.appRef.update(data);
    }
}
