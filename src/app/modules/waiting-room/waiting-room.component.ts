import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { CurrentUserModel } from '../../common/models/CurrentUserModel';
import { GuidService } from '../../common/services/GuidService';
import { IPadSupportService } from '../../common/services/ipad-support.service';
import { TokboxWaitingRoomService } from '../../common/services/tokbox-waiting-room.service';
import { AppState } from '../../store';
import { UserActions } from '../user/store';
import { WaitingRoomHelperService } from './waiting-room-helper.service';

@Component({
    selector: 'pl-waiting-room',
    templateUrl: 'waiting-room.component.html',
    styleUrls: ['./waiting-room.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLWaitingRoomComponent implements OnInit {
    currentUser: any = {};
    clinicianUsername: string;
    name: any;
    persona: any;
    awaiting = false;
    blurEventEnabled = true;
    micEnabled = true;

    constructor(private tokboxWaitingRoomService: TokboxWaitingRoomService,
                private currentUserModel: CurrentUserModel,
                private guidService: GuidService,
                private iPadService: IPadSupportService,
                private ngrxStoreService: Store<AppState>,
                private waitingRoomHelper: WaitingRoomHelperService,
                private changeDetector: ChangeDetectorRef,
    ) {
        this.clinicianUsername = this.waitingRoomHelper.getClinicianUsername();

        const browserId = this.getBrowserId();
        (this.currentUserModel.user as any).browserId = browserId;
        this.ngrxStoreService.dispatch(UserActions.startAdmission({
            browserId: currentUserModel.user.uuid,
        }));

        this.name = this.currentUserModel.user.getName();
        this.tokboxWaitingRoomService.initTokbox(null).then(() => {
            this.awaitAdmission();
        });

    }

    ngOnInit() {
    }

    cancelAwaitness = () => {
        if (this.awaiting) {
            this.tokboxWaitingRoomService.cancelAwaitAdmission(this.currentUserModel.user.uuid);
        }
    }

    getBrowserId = () => {
        const existingId = localStorage.getItem('pl-browser-id');

        if (existingId) {
            return existingId;
        }

        const newId = this.guidService.generateUUID();
        localStorage.setItem('pl-browser-id', newId);

        return newId;
    }

    handleBlur = () => {
        // if iPad users switch away from the browser/tab while in the waiting room and then return
        // it can be problematic, and leave things in a hanging state
        if (this.iPadService.isIPad()) {
            window.location.reload();
        }
    }

    awaitAdmission() {
        this.awaiting = true;
        (this.currentUserModel.user as any).waitingId = (this.currentUserModel.user  as any).browserId;
        this.ngrxStoreService.dispatch(UserActions.waitAdmission());

        this.tokboxWaitingRoomService.awaitAdmission(
            this.name,
            this.currentUserModel.user.uuid,
            !!window.roomGlobal.isIPadSafari,
            (token) => {
                this.blurEventEnabled = false;
                (this.currentUserModel.user as any).token = token;

                this.ngrxStoreService.dispatch(UserActions.setAdmitted({
                    token,
                    joinMuted: !this.micEnabled,
                }));

                this.waitingRoomHelper.redirectToClinicianRoom();
                this.awaiting = false;
            },
            () => {
                this.currentUserModel.logout().then(() => {
                    this.waitingRoomHelper.redirectToStudentLogin();
                });
            },
        );
    }
}
