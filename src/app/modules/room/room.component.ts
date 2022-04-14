import * as angular from 'angular';
import { roomModule } from './room.module';
import * as $ from 'jquery';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { DrawerState, selectDrawer } from './pl-drawers/store';
import { AppActions, LayoutMode, selectClientClickMuted, selectLayoutMode, selectSharedCursorOn } from './app/store';
import { ProfileMenuActions } from './pl-profile-menu/store';
import { selectAtLeastOneStudent, selectIsYoutubeInteractionPending } from './session/store';

class RoomController {
    static $inject = [
        '$log',
        '$scope',
        '$timeout',
        'roomnameModel',
        'firebaseAppModel',
        'appModel',
        'pageTitleModel',
        'currentUserModel',
        'AssessmentModel',
        'rightsMgmtService',
        'loginMonitorService',
        'ngrxStoreService',
        'tokboxRecordService',
    ];

    appModel: any;
    firebaseAppModel: any;
    showExitFromRoom: boolean;
    user: any;
    currentUserModel: any;
    classes = {
        sharedCursorBigHand: false,
        sharedCursorOn: false,
    };

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    upperToolbarHeight = 44; // Not always visible, so hard coded.
    lowerToolbarHeight = 44; // Not always visible, so hard coded.
    rightToolbar = 44; // Not always visible, so hard coded.
    ASPECT_RATIO = 4 / 3;

    cursorBlockedEle = null;
    timeouts = {
        touchCursor: null,
    };

    currentUser: any;
    room: any;
    AssessmentModel: any;
    confirm: () => void;
    closeConfirm: () => void;

    drawerState: DrawerState;
    sharedCursorOn = false;
    isMouseMuted = false;
    layoutMode = LayoutMode.compact;
    atLeastOneStudent = false;
    isYoutubeInteractionPending = false;

    constructor(private $log, $scope, $timeout, private roomnameModel, firebaseAppModel, appModel,
                pageTitleModel,
                currentUserModel,
                AssessmentModel,
                rightsMgmtService,
                loginMonitorService,
                private ngrxStoreService: Store<AppState>,
                // TODO This needs to be injected in order to be instantiated and start a
                // subscription. We should remove this after session record is on ng2+
                tokboxRecordService,
                ) {
        this.user = currentUserModel.user;
        this.appModel = appModel;
        this.firebaseAppModel = firebaseAppModel;
        this.showExitFromRoom = false;
        this.currentUserModel = currentUserModel;
        this.AssessmentModel = AssessmentModel;

        if (this.isStudentUser()) {
            loginMonitorService.start();
        }

        pageTitleModel.set('Room');

        console.log('navigator.maxTouchPoints: ', navigator.maxTouchPoints);
        console.log('navigator.platform: ', navigator.platform);
        console.log('navigator.userAgent: ', navigator.userAgent);

        // After adding intro.js, after started introjs, this would stop firing. Switching to jQuery fixed it.
        // (<any> window).onresize = () => {
        $(window).on('resize', () => {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
            $timeout(() => {}, 0);
        // };
        });

        appModel.showExit$.subscribe(() => {
            this.showExitFromRoom = true;
        });

        this.cursorBlockedEle = document.getElementsByClassName('room-cursor-blocked')[0];
        $(document).on('touchstart', (evt) => {
            if (this.isMouseMuted && this.isStudentUser() &&
                evt.originalEvent && evt.originalEvent.touches && evt.originalEvent.touches.length > 0) {
                if (this.timeouts.touchCursor) {
                    clearTimeout(this.timeouts.touchCursor);
                }
                // Account for width and height of cursor element itself, as well as base position offset from document body.
                // Putting this div by the cursor will actually block touch events on its own, which we do not want to
                // do, so put it a little below the actual touch.
                const offsetLeft = 20;
                const offsetTop = 20;
                this.cursorBlockedEle.style.display = 'block';
                this.cursorBlockedEle.style.left = `${(evt.originalEvent.touches[0].pageX + offsetLeft)}px`;
                this.cursorBlockedEle.style.top = `${(evt.originalEvent.touches[0].pageY + offsetTop)}px`;
                this.timeouts.touchCursor = setTimeout(() => {
                    this.cursorBlockedEle.style.display = 'none';
                }, 1000);
            }
        });

        this.confirm = () => {
            this.currentUserModel.logout();
            this.showExitFromRoom = false;
        };

        this.closeConfirm = () => {
            this.showExitFromRoom = false;
        };

        // Turn shared cursor off to start, as it is performance intensive.
        // Need to wait for variables to load.
        setTimeout(() => {
            if (this.user.groups.includes('Provider') || this.user.groups.includes('Therapist')) {
                if (!this.assessmentActive()) {
                    this.ngrxStoreService.dispatch(
                        AppActions.setCursorSharing({ isCursorShared: false, isToggleDisabled: false }),
                    );
                } else {
                    const toggleDisabled = this.atLeastOneStudent ? true : false;
                    this.ngrxStoreService.dispatch(
                        AppActions.setCursorSharing({ isCursorShared: true, isToggleDisabled: toggleDisabled }),
                    );
                    // this.firebaseAppModel.setSharedCursorOn(true, toggleDisabled);
                }

                this.firebaseAppModel.setAudioLevelsOn(false);
            }
        }, 4000);

        if (this.user.isClinicianOrExternalProvider()) {
            rightsMgmtService.handleJWTRequests();
        }

        const subscription = this.ngrxStoreService.select(selectDrawer).subscribe((drawer) => {
            this.drawerState = drawer;
        });

        $scope.$on('$destroy', () => {
            subscription.unsubscribe();
        });

        ngrxStoreService.select(selectSharedCursorOn).subscribe((isCursorShared) => {
            this.sharedCursorOn = isCursorShared;
            this.classes.sharedCursorOn = isCursorShared;
        });
        ngrxStoreService.select(selectClientClickMuted).subscribe((isMuted) => {
            this.isMouseMuted = isMuted;
        });
        ngrxStoreService.select(selectLayoutMode).subscribe((layoutMode) => {
            this.layoutMode = layoutMode;
        });
        ngrxStoreService.select(selectAtLeastOneStudent).subscribe((atLeastOneStudent) => {
            this.atLeastOneStudent = atLeastOneStudent;
        });

        ngrxStoreService.select(selectIsYoutubeInteractionPending).subscribe((isYoutubeInteractionPending) => {
            this.isYoutubeInteractionPending = isYoutubeInteractionPending;
        });
    }

    assessmentActive() {
        if (this.firebaseAppModel.app.activitiesActive &&
            (this.AssessmentModel.share || this.firebaseAppModel.app.activeActivity &&
            this.firebaseAppModel.app.activeActivity.activity_type === 'assessment')) {
            return true;
        }
        return false;
    }

    mainClasses() {
        if (this.AssessmentModel.share && this.firebaseAppModel.app.activitiesActive) {
            this.classes.sharedCursorBigHand = true;
        } else {
            this.classes.sharedCursorBigHand = false;
        }
        this.classes.sharedCursorOn = this.sharedCursorOn;
        return {
            'main-view': true,
            'right-drawer-open': this.drawerState.activeName && this.drawerState.open,
            'right-drawer-large': this.drawerState.activeName === 'activities' &&
                                this.appModel.app.quickAddOpen === true && this.drawerState.open,
            'whiteboard-active': this.firebaseAppModel.app.whiteboardActive === true,
            'jumbotron-mode': this.layoutMode === LayoutMode.jumbotron,
            'bradybunch-mode': this.layoutMode === LayoutMode.grid,
            'team-write-active': this.firebaseAppModel.app.teamWriteActive === true,
            'student-mode': this.isStudentUser(),
        };
    }

    showWhiteboardToolSelect() {
        return !this.firebaseAppModel.app.siteshareActive && !this.firebaseAppModel.app.remoteHQActive;
    }

    getAspectRatioConstrictionStyles() {
        let arcHeight;
        let arcWidth;
        let arcOffsetTop = 0;
        const leftDrawer = 212;
        const rightDrawer = this.drawerState.activeName && this.drawerState.open ? 236 : this.rightToolbar;
        const centralAreaWidth = this.windowWidth - leftDrawer - rightDrawer;
        let centralAreaHeight;
        const offsetHeight = this.isStudentUser() ? 0 : 64; // Top toolbar height (providers only)

        if (this.firebaseAppModel.app.whiteboardActive || this.appModel.showAssessmentInstructionsJumbotronOverlay) {
            centralAreaHeight = this. windowHeight - this.upperToolbarHeight - this.lowerToolbarHeight - offsetHeight;
            arcOffsetTop += this.upperToolbarHeight + this.lowerToolbarHeight;
        } else {
            centralAreaHeight =  this.windowHeight - offsetHeight;
        }
        const isWide = centralAreaWidth / centralAreaHeight > this.ASPECT_RATIO;

        if (isWide) {
            arcHeight = centralAreaHeight;
            arcWidth = arcHeight * this.ASPECT_RATIO;
        } else {
            arcWidth = centralAreaWidth;
            arcHeight = (arcWidth / this.ASPECT_RATIO);
            arcOffsetTop += (centralAreaHeight - arcHeight) / 2;
        }

        return {
            width: arcWidth,
            height: arcHeight,
            top: arcOffsetTop,
        };
    }

    centralContentClick(e) {
        // this.$broadcast('centralContentClick', {event: e});
    }

    handleLogInfo(e) {
        this.$log.info('OT: ' + this.roomnameModel.value.tokbox_session_id);
        this.$log.info('FB: ' + this.roomnameModel.value.name);
        e.preventDefault();
    }

    showProfileMenu() {
        return this.appModel.app.showProfileMenu;
    }

    isStudentUser() {
        return this.currentUserModel.user.isInGroup('student');
    }

    isObserver() {
        return this.currentUserModel.user.isInGroup('observer');
    }

    toggleProfileMenu() {
        this.appModel.app.showProfileMenu = !this.appModel.app.showProfileMenu;
        this.ngrxStoreService.dispatch(ProfileMenuActions.toggleDisplay());
    }
}
export default RoomController;

roomModule.component('room', {
    template: require('./room.component.html'),
    bindings: {
        room: '<',
        currentUser: '<',
    },
    controller: RoomController,
});
