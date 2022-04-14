import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { AppStore } from '../../appstore.model';
import { DrawerActions, DrawerNameType } from '../../modules/room/pl-drawers/store';
import { PLWidgetsBoardModelService } from '../../modules/room/pl-widgets/pl-widgets-board/pl-widgets-board-model.service';
import { commonModelsModule } from './models.module';
import { ScreenshareActions } from '../../modules/room/conference/screenshare/store';
import { selectPromotedStreamsCount } from '../../modules/room/conference/store';
import { AppState } from '../../store';

export class AppModel {
    private showExitSource = new Subject();
    showExit$ = this.showExitSource.asObservable();
    $log: any;
    $interval: any;
    $currentUserModel: any;
    $firebaseAppModel: any;
    dispatcherService: any;
    localStorageService: any;
    angularCommunicatorService: any;
    ngrxStoreService: Store<AppState>;
    drawerIsHiddenValue: boolean;
    app: {
        documentationActive: boolean;
        activeDrawer:  string;
        bugReportVisible: boolean;
        submitIdeaVisible: boolean;
        sameSiteHostUrl: string;
        sameSiteGuestUrl: string;
        remoteHQHostUrl: string;
        remoteHQGuestUrl: string;
        iAmHost: any;
        updatingScreenshareVideo: boolean;
        backgroundBlurOn: boolean;
    };
    timeouts = {
        chatOpen: null,
    };
    promotedStreamsCount = 0;
    constructor($log, $interval, dispatcherService, firebaseAppModel, private currentUserModel,
                localStorageService, plAppGlobal, private widgetsBoardModel: PLWidgetsBoardModelService,
                private assessmentModel, angularCommunicatorService, ngrxStoreService) {
        this.$log = $log;
        this.$interval = $interval;
        this.$currentUserModel = currentUserModel;
        this.$firebaseAppModel = firebaseAppModel;
        this.dispatcherService = dispatcherService;
        this.localStorageService = localStorageService;
        this.angularCommunicatorService = angularCommunicatorService;
        this.ngrxStoreService = ngrxStoreService;

        try {
            this.drawerIsHiddenValue = localStorageService.get('drawerIsHidden') === 'true';
        } catch (e) {
            $log.debug('error reading drawerIsHiddenValue from localStorageService in AppModel: ', e);
        }

        // default app states
        this.app = {
            documentationActive: false,
            activeDrawer: sessionStorage.getItem('activeDrawer'),
            bugReportVisible: false,
            submitIdeaVisible: false,
            sameSiteHostUrl: '',
            sameSiteGuestUrl: '',
            remoteHQHostUrl: '',
            remoteHQGuestUrl: '',
            iAmHost: undefined,
            updatingScreenshareVideo: false,
            backgroundBlurOn: false,
        };

        if (this.app.activeDrawer === 'null') {
            this.app.activeDrawer = null;
        }
        // show drawer in observer mode by default because the area is not clickable
        if (plAppGlobal.isObserverMode()) {
            this.drawerIsHiddenValue = false;
            this.app.activeDrawer = 'chat';
        }

        // default to activities drawer being open for now
        if (!this.app.activeDrawer && currentUserModel.user.isClinicianOrExternalProvider()) {
            this.app.activeDrawer = 'activities';
        } else {
            this.app.activeDrawer = 'chat';
            this.drawerIsHiddenValue = true;
        }

        // TODO: Find a better place to initialize drawer
        this.ngrxStoreService.dispatch(
            DrawerActions.init({
                open: !this.drawerIsHiddenValue,
                drawerName: this.app.activeDrawer as DrawerNameType,
            }),
        );

        if (this.app.activeDrawer === 'activities') {
            this.$firebaseAppModel.showWorkspace(true);
        }
        this.ngrxStoreService.select(selectPromotedStreamsCount).subscribe((count) => {
            this.promotedStreamsCount = count;
        });
        $log.debug('[AppModel] Creating AppModel');
    }

    get showAssessmentInstructionsJumbotronOverlay() {
        const fullscreen = this.$firebaseAppModel.app.layoutMode ? this.$firebaseAppModel.app.layoutMode !== 'compact' :
            this.$firebaseAppModel.app.fullscreen !== 'normal';
        return this.$firebaseAppModel.app.activeActivity
                && this.$firebaseAppModel.app.activeActivity.activity_type === 'assessment'
                && fullscreen
                && this.promotedStreamsCount < 2 && this.assessmentModel.getShowInstructions();
    }

    get drawerIsHidden() {
        return this.drawerIsHiddenValue;
    }

    set drawerIsHidden(value) {
        this.localStorageService.set('drawerIsHidden', this.drawerIsHiddenValue = value);
        $(window).resize();
    }

    setVideoFullscreen(mode) {
        this.dispatcherService.dispatch('fullscreenChangeRequestEvent', null, mode);
    }

    openDrawer(drawerName: string) {

        if (this.timeouts.chatOpen) {
            clearTimeout(this.timeouts.chatOpen);
        }

        const cleanup = () => {
            this.toggleSessionRecordDrawer(false);
            this.toggleViewSessionRecording(false);
            this.setVideoFullscreen('normal');
        }

        if (drawerName === 'teamWrite') {
            cleanup();
            this.$firebaseAppModel.showWorkspace(false);
            this.$firebaseAppModel.setActiveActivity(null);
            this.toggleScreenshare(false);
            this.toggleSiteshare(false);
            this.toggleRemoteHQ(false);
            this.toggleActivities(false);
            this.toggleGames(false);
        }

        if (drawerName === 'games') {
            cleanup();
            this.$firebaseAppModel.showWorkspace(false);
            this.$firebaseAppModel.setActiveActivity(null);
            this.toggleScreenshare(false);
            this.toggleSiteshare(false);
            this.toggleRemoteHQ(false);
            this.toggleActivities(false);
            this.toggleTeamWrite(false);
            this.toggleGames(true);
        }

        if (drawerName === 'cobrowse') {
            cleanup();
            this.toggleTeamWrite(false);
            this.toggleActivities(false);
            this.$firebaseAppModel.showWorkspace(false);
            this.$firebaseAppModel.setWhiteboardActive(false);
            this.toggleGames(false);
        }

        if (drawerName === 'activities') {
            cleanup();
            this.toggleActivities(true);
            this.toggleTeamWrite(false);
            this.toggleScreenshare(false);
            this.toggleSiteshare(false);
            this.toggleRemoteHQ(false);
            this.toggleGames(false);

            if (this.app.activeDrawer !== drawerName) {
                this.$firebaseAppModel.showWorkspace(true);
            }
        }

        if (drawerName === 'chat') {
            this.resetChatTimeout();
        }

        if (this.app.activeDrawer === drawerName) {
            this.drawerIsHidden = !this.drawerIsHidden;
            this.angularCommunicatorService.onWorkspaceDrawerChange();
        } else {
            if (this.drawerIsHidden === true) {
                this.angularCommunicatorService.onWorkspaceDrawerChange();
            }
            this.drawerIsHidden = false;
            this.app.activeDrawer = drawerName;
        }
        // 160 is a hardcoded match to just above the 150 animation time.
        this.widgetsBoardModel.recalcBoardLoop(null, null, null, null, 160, 10);

        sessionStorage.setItem('activeDrawer', this.app.activeDrawer);
    }

    resetChatTimeout() {
        if (this.timeouts.chatOpen) {
            clearTimeout(this.timeouts.chatOpen);
        }
        if (!this.currentUserModel.user.isInGroup('observer')) {
            this.timeouts.chatOpen = setTimeout(() => {
                if (this.app.activeDrawer === 'chat') {
                    this.closeDrawer();
                }
            }, 3 * 60 * 1000);
        }
    }

    closeDrawer() {
        this.drawerIsHidden = true;
        this.ngrxStoreService.dispatch(DrawerActions.close());
        this.angularCommunicatorService.onWorkspaceDrawerChange();
        // 160 is a hardcoded match to just above the 150 animation time.
        this.widgetsBoardModel.recalcBoardLoop(null, null, null, null, 160, 10);
    }

    toggleTeamWrite(value) {
        if (value !== this.$firebaseAppModel.app.teamWriteActive) {
            this.$firebaseAppModel.setTeamWriteActive(value);

            if (this.$firebaseAppModel.app.teamWriteActive) {
                this.$firebaseAppModel.setWhiteboardActive(false);
            }
        }
    }

    toggleGames(value) {
        if (value !== this.$firebaseAppModel.app.gamesActive) {
            this.$firebaseAppModel.setGamesActive(value);

            if (this.$firebaseAppModel.app.gamesActive) {
                this.$firebaseAppModel.setWhiteboardActive(false);
            }
        }
    }

    toggleSessionRecordDrawer(value) {
        if (value !== this.$firebaseAppModel.app.sessionRecordDrawerActive) {
            this.$firebaseAppModel.setSessionRecordDrawerActive(value);
        }
    }

    toggleViewSessionRecording(value) {
        if (value !== this.$firebaseAppModel.app.sessionRecordingViewerActive) {
            this.$firebaseAppModel.setSessionRecordingViewerActive(value);
            if (value) {
                this.toggleTeamWrite(false);
                this.toggleScreenshare(false);
                this.toggleSiteshare(false);
                this.toggleRemoteHQ(false);
                this.$firebaseAppModel.showWorkspace(false);
            }
        }
    }

    viewSessionRecordingVideo(video) {
        this.toggleViewSessionRecording(true);
        this.$firebaseAppModel.setSessionRecordingVideo(video);
    }

    toggleScreenshare(value) {
        const action = value ? ScreenshareActions.start() : ScreenshareActions.stop();
        this.ngrxStoreService.dispatch(action);
    }

    toggleSiteshare(value) {
        this.$firebaseAppModel.setSiteshareActive(value);
    }

    toggleRemoteHQ(value) {
        this.$firebaseAppModel.setRemoteHQActive(value);
    }

    toggleActivities(value) {
        this.$firebaseAppModel.setActivitiesActive(value);
    }

    toggleWhiteboard() {
        this.$firebaseAppModel.setWhiteboardActive(!this.$firebaseAppModel.app.whiteboardActive);

        if (this.$firebaseAppModel.app.teamWriteActive && this.$firebaseAppModel.app.whiteboardActive) {
            this.$firebaseAppModel.setTeamWriteActive(false);
        }
    }

    showExitFromRoom() {
        this.showExitSource.next();
    }
}

commonModelsModule.service('appModel', ['$log', '$interval', 'dispatcherService', 'firebaseAppModel',
    'currentUserModel', 'localStorageService', 'plAppGlobal', 'plWidgetsBoardModelService', 'AssessmentModel',
    'angularCommunicatorService', 'ngrxStoreService', AppModel]);
