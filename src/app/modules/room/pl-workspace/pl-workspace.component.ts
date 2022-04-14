import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppModel } from '@root/src/app/common/models/app-model.service';
import { DRFActivityModel } from '@root/src/app/common/models/DRF/DRFActivityModel.service';
import { DRFAssessmentModel } from '@root/src/app/common/models/DRF/DRFAssessmentModel.service';
import { DRFGameModel } from '@root/src/app/common/models/DRF/DRFGameModel.service';
import { FirebaseAppModel } from '@root/src/app/common/models/firebase/firebase-app-model.service';
import { AppState } from '@root/src/app/store';
import { PLHttpService, PLUrlsService } from '@root/src/lib-components';
import { ActivityService } from '@root/src/toys/src/modules/activity/activity.service';
import { AssessmentService } from '@root/src/toys/src/modules/assessment/assessment.service';
import { Subscription } from 'rxjs';
import { selectCurrentUser } from '../../user/store';
import { AppActions } from '../app/store';

enum activityTypes {
    ACTIVITIY = 'activity',
    ASSESSMENT = 'assessment',
    GAME = 'game',
    INSTANT_YOUTUBE = 'instant_youtube',
}

@Component({
    selector: 'pl-workspace',
    templateUrl: 'pl-workspace.component.html',
    styleUrls: ['./pl-workspace.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLWorkspaceComponent implements OnInit, OnDestroy {
    showActivity = false;
    activityType;
    private currentService;
    private currentActivityType;
    private lastActiveActivity;
    private currentUser;
    private types = [activityTypes.ACTIVITIY, activityTypes.ASSESSMENT];
    private subscriptions: Subscription[] = [];
    constructor(private firebaseAppModel: FirebaseAppModel,
                private activityService: ActivityService,
                private assessmentService: AssessmentService,
                private appModel: AppModel,
                private plUrls: PLUrlsService,
                private http: PLHttpService,
                private store: Store<AppState>) {
        this.subscriptions.push(
            store.select(selectCurrentUser)
            .subscribe((user: any) => {
                this.currentUser = user;
            }),
            firebaseAppModel.activeActivityChanged.subscribe((activity) => {

                if (this.isSameActivity(activity, this.lastActiveActivity)) {
                    return;
                }
                if (!activity) {
                    this.lastActiveActivity = activity;
                }
                this.showActivity = false;
                setTimeout(() => {
                    if (!activity) {
                        if (this.currentService) {
                            this.currentService.reset();
                        }
                        if (this.currentActivityType === activityTypes.ASSESSMENT) {
                            this.setSharedCursor(false);
                        }
                        return;
                    }
                    this.appModel.toggleActivities(true);
                    const isActivity = activity.activity_type === activityTypes.ACTIVITIY;
                    const isGame = activity.activity_type === activityTypes.GAME;
                    const isAssessment = activity.activity_type === activityTypes.ASSESSMENT;

                    if (this.types.indexOf(activity.activity_type) !== -1) {
                        activity.resource_type = activity.activity_type;
                    }
                    this.activityType = activity.type;
                    this.currentActivityType = activity.activity_type;

                    if (!isGame) {
                        const token = this.currentUser.token;

                        this.currentService = isActivity ? this.activityService : this.assessmentService;
                        this.currentService.startup(activity, token).then(() => {
                            this.showActivity = true;
                        });
                    } else {
                        this.showActivity = true;
                    }

                    if ((activity && !this.lastActiveActivity) 
                        || !this.isSameActivity(activity, this.lastActiveActivity)) {
                        if (isActivity && activity.type !== activityTypes.INSTANT_YOUTUBE) {
                            this.recordActivityUse(activity.id);
                        } else if (isGame) {
                            this.recordGameUse(activity.id);
                        } else if (isAssessment) {
                            this.recordAssessmentUse(activity.id);
                        }
                    }
                    this.lastActiveActivity = Object.assign({}, activity);
                });
            }),
        );
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.setSharedCursor(false);
        if (!this.currentService) {
            return;
        }
        this.currentService.reset();
        this.currentService = null;
    }

    private setSharedCursor = (sharedOn: boolean, toggleDisabled = 0) => {
        let toggleDisabledValue = toggleDisabled;
        if (toggleDisabled && !this.firebaseAppModel.app.atLeastOneStudent) {
            toggleDisabledValue = 0;
        }
        this.store.dispatch(
            AppActions.setCursorSharing({ isCursorShared: sharedOn, isToggleDisabled: !!toggleDisabled }),
        );
    }

    recordActivityUse(activityId) {
        const useToken = this.currentUser.token;
        const activityModel = new DRFActivityModel(this.http, this.plUrls);
        activityModel.setKey(activityId);
        this.subscriptions.push(
            activityModel.use(useToken).subscribe(),
        );
    }

    recordAssessmentUse(activityId) {
        const useToken = this.currentUser.token;
        if (this.isClinicianOrExternalProvider()) {
            const assessmentModel = new DRFAssessmentModel(this.http, this.plUrls);
            assessmentModel.setKey(activityId);
            this.subscriptions.push(
                assessmentModel.use(useToken).subscribe(),
            );
        }
    }

    recordGameUse(activityId) {
        const useToken = this.currentUser.token;
        if (this.isStudent()) {
            const gameModel = new DRFGameModel(this.http, this.plUrls);
            gameModel.setKey(activityId);

            this.subscriptions.push(
                gameModel.use(useToken).subscribe(),
            );
        }
    }

    isSameActivity(newActivity, lastActivity) {
        return newActivity && lastActivity &&
            (newActivity.activityId === lastActivity.activityId &&
            newActivity.queueId === lastActivity.queueId);
    }

    isTeamWriteActive() {
        return this.firebaseAppModel.app.teamWriteActive;
    }

    // when in fullscreen mode and displaying assessment instructions, we need to bump up the z-index 
    // of the workspace in order to get the instructions to appear. otherwise, keep the workspace 
    // z-index below the whiteboard
    showAssessmentInstructionsJumbotronOverlay = () => {
        return this.appModel.showAssessmentInstructionsJumbotronOverlay;
    }

    isWhiteboardActive() {
        return this.firebaseAppModel.app.whiteboardActive;
    }

    shouldShowWorkspace() {
        return this.firebaseAppModel.app.shouldShowWorkspace || (this.appModel as any).previewMode;
    }

    isClinicianOrExternalProvider() {
        return this.currentUser.groups &&
        (
            this.currentUser.groups.includes('Therapist') || this.currentUser.groups.includes('Administrator') ||
            this.currentUser.groups.includes('School Staff Providers') || this.currentUser.groups.includes('Private Practice')
        );
    }

    isStudent() {
        return this.currentUser.groups && this.currentUser.groups.includes('student')
    }
}
