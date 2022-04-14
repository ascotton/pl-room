import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { FirebaseRef } from '@common/firebase/firebase-ref';
import { FirebaseService } from '@common/firebase/firebase.service';
import { ConferenceService } from '../conference.service';

@Injectable()
export class ScreenshareService {
    static ID = 'SCREENSHARE';
    private screenshareStatusRef: FirebaseRef<boolean>;

    constructor(
        firebaseService: FirebaseService,
        private conferenceService: ConferenceService,
    ) {
        this.screenshareStatusRef = new FirebaseRef<boolean>(
            firebaseService.getLazyRoomRef('app/screenshareActive'),
        );
    }

    start() {
        return this.conferenceService.startScreenshare(ScreenshareService.ID);
    }

    stop() {
        return this.conferenceService.stopScreenshare(ScreenshareService.ID);
    }

    getMediaStream() {
        return this.conferenceService.getMediaStream(ScreenshareService.ID);
    }

    setIsActive(isActive: boolean) {
        return this.screenshareStatusRef.set(isActive);
    }

    onIsActiveChanged() {
        return this.screenshareStatusRef.valueChanges.pipe(
            map(s => s.val()),
        );
    }
}
