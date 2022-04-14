import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TokboxWaitingRoomService } from '@common/services/tokbox-waiting-room.service';
import { Participant, ParticipantStatus, ParticipantType, SessionActions, SessionState } from '@room/session/store';
import { AppState } from '@app/store';
import { selectCurrentUser } from '../../modules/user/store';
import { GuidService } from './GuidService';

@Injectable({ providedIn: 'root' })
export class PLWaitingRoomService {
    private knockAudio = new Audio('/assets/audio/sign-on.mp3');

    constructor(private tokboxWaitingRoomService: TokboxWaitingRoomService,
                private store: Store<AppState>) {
        store.select(selectCurrentUser).subscribe((user) => {
            if (user && this.isClinician(user)) {
                this.tokboxWaitingRoomService.awaitStudentLogin(
                    (name, id, isIpad) => {
                        this.knockAudio.play();
                        this.addWaitingParticipant(name, id, isIpad);
                    },
                    (id) => {
                        this.store.dispatch(SessionActions.kick({ id }));
                    },
                );
            }
        });
    }

    admitParticipant(participant: Participant) {
        this.store.dispatch(
            SessionActions.admit(
                { id: participant.id },
            ),
        );
        this.tokboxWaitingRoomService.admitStudent(participant.userId, participant.displayName).then(
            () => {},
            () => {
                this.store.dispatch(
                    SessionActions.studentAdmissionFailed(
                        { id: participant.id },
                    ),
                );
            },
        );
    }

    denyParticipant({ id, displayName }: Participant) {
        this.tokboxWaitingRoomService.denyStudent(id, displayName);
        this.store.dispatch(SessionActions.kick({ id }));
    }

    private addWaitingParticipant(name, id, isIpad = false) {
        const participant: Participant = {
            id,
            userId: id,
            isLocal: false,
            displayName: name,
            type: ParticipantType.guest,
            status: ParticipantStatus.waiting,
            isViewingPage: true,
            isIPad: isIpad,
            omitFromSessionRecord: false,
            isYoutubeInteractionPending: false,
            joinMuted: false,
        };
        this.store.dispatch(SessionActions.addWaiting({ participant }));
    }

    private isClinician(user) {
        return user.groups && (user.groups.includes('Provider') ||
            user.groups.includes('Therapist') ||
            user.groups.includes('School Staff Providers') ||
            user.groups.includes('Private Practice'));
    }

}
