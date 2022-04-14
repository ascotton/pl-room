import { Injectable } from '@angular/core';
import { FirebaseService } from '@common/firebase/firebase.service';
import { FirebaseCollection, Add, Update } from '@common/firebase/firebase-collection';
import { User } from '@modules/user/user.model';
import { Participant, ParticipantType, RTParticipant } from './store/session.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SessionService {
    private sessionRef: FirebaseCollection<RTParticipant>;

    constructor(firebaseService: FirebaseService) {
        this.sessionRef = new FirebaseCollection(
            firebaseService.getLazyRoomRef('session'),
        );
    }

    onParticipantAdded() {
        return this.sessionRef.onAdded();
    }

    onParticipantChanged() {
        return this.sessionRef.onChanged();
    }

    onParticipantRemoved() {
        return this.sessionRef.onRemoved();
    }

    hasParticipant(id: string) {
        return this.sessionRef.hasChild(id);
    }

    getParticipantsByUserId(userId: string) {
        return this.sessionRef.getAll().pipe(
            map(participants => participants.filter(p => p.userId === userId)),
        );
    }

    addParticipant({ isLocal, ...participant }: Add<Participant>) {
        return this.sessionRef.add(participant);
    }

    updateParticipant(id: string, { isLocal, ...data }: Update<Participant>) {
        return this.sessionRef.update(id, data);
    }

    removeParticipant(id: string) {
        return this.sessionRef.remove(id);
    }

    removeMultipleParticipants(ids: string []) {
        return this.sessionRef.bulkRemove(ids);
    }

    createDisconnectedRef(id: string) {
        const childRef = this.sessionRef.getChildRef(id);
        return childRef.createOnDisconnect();
    }

    getUserParticipantType(user: User) {
        const isStudent = user.groups.includes('student');
        const isObserver = user.isObserver;

        if (isObserver) {
            return ParticipantType.observer;
        }

        if (!isStudent) {
            return ParticipantType.host;
        }

        return ParticipantType.guest;
    }
}
