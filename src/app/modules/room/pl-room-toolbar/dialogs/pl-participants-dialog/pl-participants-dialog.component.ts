import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { PLWaitingRoomService } from '@common/services/pl-waiting-room.service';
import { Participant, selectJoinedStudents, selectWaitingRoomList, SessionActions } from '@modules/room/session/store';
import { AppState } from '@app/store';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pl-participants-dialog',
    templateUrl: 'pl-participants-dialog.component.html',
    styleUrls: ['./pl-participants-dialog.component.less'],
})
export class PLParticipantsDialogComponent implements OnInit, OnDestroy {
    participantList: Participant[] = [];
    waitingRoomList: Participant[] = [];
    private subscriptions: Subscription[] = [];

    constructor(private bottomsheet: MatBottomSheetRef<PLParticipantsDialogComponent>,
                private store: Store<AppState>,
                private waitingRoomService: PLWaitingRoomService,
                changeDetector: ChangeDetectorRef) {
        this.subscriptions.push(
            this.store.select(selectJoinedStudents).subscribe((participants) => {
                this.participantList = [...participants];
                changeDetector.markForCheck();
            }),
            this.store.select(selectWaitingRoomList).subscribe((participants) => {
                this.waitingRoomList = [...participants];
                changeDetector.markForCheck();
            }),
        );
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    onClose() {
        this.bottomsheet.dismiss();
    }

    onAdmit(participant: Participant) {
        this.waitingRoomService.admitParticipant(participant);
    }

    onDenyAdmission(participant: Participant) {
        this.waitingRoomService.denyParticipant(participant);
    }

    onDismissParticipant(participant: Participant) {
        this.store.dispatch(SessionActions.kick({ id: participant.id }));
    }

    getId(index, item: Participant) {
        return item.id;
    }

    getParticipantDevice(participant: Participant) {
        return participant.isIPad ? 'iPad' : 'Laptop/Computer';
    }
}
