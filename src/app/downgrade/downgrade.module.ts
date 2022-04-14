import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';

import { Store } from '@ngrx/store';
import { AppStore } from '@app/appstore.model';

import { PLDotLoaderComponent } from '@lib-components/pl-dot-loader/pl-dot-loader.component';
import { PLIconComponent } from '@lib-components/pl-icon/pl-icon.component';
import { PLInputCheckboxComponent } from '@lib-components/pl-input/pl-input-checkbox.component';

import { AppGlobalComponent } from '@app/modules/app-global/app-global.component';
import { PLCommonOverlaysComponent } from '../common/components/pl-common-overlays/pl-common-overlays.component';
import { PLInactiveComponent } from '../modules/user/pl-inactive/pl-inactive.component';
import { IntrojsService } from '../common/services-ng2/introjs.service';
import { LoginMonitorService } from '../common/services-ng2/login-monitor.service';

import { AngularCommunicatorService } from './angular-communicator.service';

import { PLGameComponent } from
    '@toys/src/modules/game/pl-game.component';
import { PLGameDrawerComponent } from
    '@toys/src/modules/game/pl-game-drawer.component';
import { PLQueueAddComponent } from
    '../modules/pl-queue/pl-queue-add/pl-queue-add.component';

import { PLRightDrawersComponent } from '../modules/room/pl-drawers';
import { PLWidgetsOverlayComponent } from '../modules/room/pl-widgets/pl-widgets-overlay/pl-widgets-overlay.component';

import { PlGamesComponent } from '@modules/pl-games';

import { PLSessionRecordDrawerControlsComponent } from
    '../../app/modules/room/drawers/session-record/pl-session-record-controls.component';

import { PLRoomCleanupService } from '../modules/user/pl-inactive/pl-room-cleanup.service';
import { PLUrlsService } from '../../lib-components/pl-http/pl-urls.service';
import { PLHttpService } from '../../lib-components/pl-http/pl-http.service';
import { PLFeatureFlagsService } from '../pl-feature-flags.service';

import { PLConfirmDialogService } from '@root/index';
import { PLWidgetsBoardComponent } from '../modules/room/pl-widgets/pl-widgets-board/pl-widgets-board.component';
import { PLWidgetsBoardModelService } from '../modules/room/pl-widgets/pl-widgets-board/pl-widgets-board-model.service';
import { AppConfigService } from '../app-config.service';
import { PLRoomOverlayComponent } from '../modules/room/pl-room-overlay';
import { PLTechCheckComponent } from '../modules/pl-setup/pl-tech-check/pl-tech-check.component';
import { PLGraphQLService } from '@root/src/lib-components';
import { PLRoomToolbarComponent } from '../modules/room/pl-room-toolbar/pl-room-toolbar.component';
import { FirebaseService } from '../common/firebase/firebase.service';
import { PLHijackHelperService } from '../common/services/pl-hijack.service';
import { PLHijackDrawerComponent } from '../common/components/pl-hijack-drawer/pl-hijack-drawer.component';
import { PLStudentSettingsComponent } from '../modules/student-login/pl-student-settings/pl-student-settings.component';
import { PLProfileMenuComponent } from '../modules/room/pl-profile-menu/pl-profile-menu.component';
import { PLWorkspaceComponent } from '../modules/room/pl-workspace';
import { DRFActivityModel } from '../common/models/DRF/DRFActivityModel.service';
import { DRFAssessmentModel } from '../common/models/DRF/DRFAssessmentModel.service';
import { DRFGameModel } from '../common/models/DRF/DRFGameModel.service';
import { DRFRoomModel } from '../common/models/DRF/DRFRoomModel.service';
import { ConferenceComponent } from '../modules/room/conference/conference.component';
import { ScreenshareComponent } from '../modules/room/conference/screenshare/screenshare.component';
import { ConferenceService } from '../modules/room/conference';

import { VideoCaptureService, PLVideoCaptureComponent } from '@modules/room/pl-video-capture/index';
import { PLWaitingRoomComponent } from '../modules/waiting-room/waiting-room.component';
import { CurrentUserService } from '../modules/user/current-user.service';
import { PLStudentLoginComponent } from '../modules/student-login/student-login.component';
import { RewardAnimationsComponent } from '../modules/reward-animations/reward-animations.component';
import { RewardAnimationsService } from '../modules/reward-animations/reward-animations.service';
import { DuplicatedProviderComponent } from '../modules/room/duplicated-provider/duplicated-provider.component';

export const downgradeModule = angular.module('downgrade', []);

// Services
downgradeModule.factory(
    'videoCaptureService',
    downgradeInjectable(VideoCaptureService) as any,
);

downgradeModule.factory(
    'angularCommunicatorService',
    downgradeInjectable(AngularCommunicatorService) as any,
);

downgradeModule.factory(
    'introjsService',
    downgradeInjectable(IntrojsService) as any,
);

downgradeModule.factory(
    'loginMonitorService',
    downgradeInjectable(LoginMonitorService) as any,
);

downgradeModule.factory(
    'plRoomCleanupService',
    downgradeInjectable(PLRoomCleanupService) as any,
);

downgradeModule.factory(
    'plUrlsService',
    downgradeInjectable(PLUrlsService) as any,
);

downgradeModule.factory(
    'plHttpService',
    downgradeInjectable(PLHttpService) as any,
);

downgradeModule.factory(
    'plGraphqlService',
    downgradeInjectable(PLGraphQLService) as any,
);

downgradeModule.factory(
    'appConfigService',
    downgradeInjectable(AppConfigService),
);

downgradeModule.factory(
    'plFeatureFlagsService',
    downgradeInjectable(PLFeatureFlagsService) as any,
);

downgradeModule.factory(
    'ngrxStoreService',
    downgradeInjectable(Store),
);

downgradeModule.factory(
    'pLConfirmDialogService',
    downgradeInjectable(PLConfirmDialogService),
);

downgradeModule.factory(
    'plWidgetsBoardModelService',
    downgradeInjectable(PLWidgetsBoardModelService),
);

downgradeModule.factory(
    'drfActivityModel',
    downgradeInjectable(DRFActivityModel),
);

downgradeModule.factory(
    'drfAssessmentModel',
    downgradeInjectable(DRFAssessmentModel),
);

downgradeModule.factory(
    'drfGameModel',
    downgradeInjectable(DRFGameModel),
);

downgradeModule.factory(
    'drfRoomModel',
    downgradeInjectable(DRFRoomModel),
);

downgradeModule.factory(
    'plHijackHelper',
    downgradeInjectable(PLHijackHelperService),
);

downgradeModule.factory(
    'firebaseService',
    downgradeInjectable(FirebaseService),
);

downgradeModule.factory(
    'conferenceService',
    downgradeInjectable(ConferenceService),
);

downgradeModule.factory(
    'currentUserService',
    downgradeInjectable(CurrentUserService),
);

downgradeModule.factory(
    'rewardAnimationsService',
    downgradeInjectable(RewardAnimationsService),
);

// Components
downgradeModule.directive(
    'plDotLoader',
    downgradeComponent({ component: PLDotLoaderComponent }) as angular.IDirectiveFactory,
);
downgradeModule.directive(
    'plIcon',
    downgradeComponent({ component: PLIconComponent }) as angular.IDirectiveFactory,
);
downgradeModule.directive(
    'plInputCheckbox',
    downgradeComponent({ component: PLInputCheckboxComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plAppGlobal',
    downgradeComponent({ component: AppGlobalComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plCommonOverlays',
    downgradeComponent({ component: PLCommonOverlaysComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plInactive',
    downgradeComponent({ component: PLInactiveComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plGame',
    downgradeComponent({ component: PLGameComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plGameDrawer',
    downgradeComponent({ component: PLGameDrawerComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plQueueAdd',
    downgradeComponent({ component: PLQueueAddComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plSessionRecordControls',
    downgradeComponent({ component: PLSessionRecordDrawerControlsComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plRightDrawers',
    downgradeComponent({ component: PLRightDrawersComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plGames',
    downgradeComponent({ component: PlGamesComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plWidgetsOverlay',
    downgradeComponent({ component: PLWidgetsOverlayComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plWidgetsBoard',
    downgradeComponent({ component: PLWidgetsBoardComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plRoomOverlay',
    downgradeComponent({ component: PLRoomOverlayComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plTechCheck',
    downgradeComponent({ component: PLTechCheckComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plConference',
    downgradeComponent({ component: ConferenceComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plScreenshare',
    downgradeComponent({ component: ScreenshareComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plRoomToolbar',
    downgradeComponent({ component: PLRoomToolbarComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plStudentSettings',
    downgradeComponent({ component: PLStudentSettingsComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plWorkspace',
    downgradeComponent({ component: PLWorkspaceComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plProfileMenu',
    downgradeComponent({ component: PLProfileMenuComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plHijackDrawer',
    downgradeComponent({ component: PLHijackDrawerComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plVideoCapture',
    downgradeComponent({ component: PLVideoCaptureComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plWaitingRoom',
    downgradeComponent({ component: PLWaitingRoomComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plStudentLogin',
    downgradeComponent({ component: PLStudentLoginComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plRewardAnimations',
    downgradeComponent({ component: RewardAnimationsComponent }) as angular.IDirectiveFactory,
);

downgradeModule.directive(
    'plDuplicatedProvider',
    downgradeComponent({ component: DuplicatedProviderComponent }) as angular.IDirectiveFactory,
);
