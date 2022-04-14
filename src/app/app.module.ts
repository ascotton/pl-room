import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import 'angular-animate';
import 'angular-resource';
import 'angular-route';
import 'angular-sanitize';
import 'angular-local-storage';
import { UpgradeModule } from '@angular/upgrade/static';

import { UIRouterUpgradeModule } from '@uirouter/angular-hybrid';
import { UIRouterModule } from '@uirouter/angular';
import { appModuleAngularJS } from './app.module.ajs';

import { StoreModule } from '@ngrx/store';

import AppStore from './store';

import { CurrentUserService } from './modules/user/current-user.service';
import { UserAuthGuardService } from './modules/user/user-auth-guard.service';
import { InactivityLogoutService } from './modules/user/inactivity-logout.service';

import { plLogoutComponent } from './modules/user/pl-logout/pl-logout.component';

import { AppComponent } from './app.component';

import { PLDotLoaderComponent } from '../lib-components/pl-dot-loader/pl-dot-loader.component';
import { PLIconComponent } from '../lib-components/pl-icon/pl-icon.component';
import { PLInputCheckboxComponent } from '../lib-components/pl-input/pl-input-checkbox.component';
import { HeapLogger } from '../lib-components/logger/heap.service';

import { AppConfigService } from './app-config.service';
import { PLFeatureFlagsService } from './pl-feature-flags.service';

import { AngularCommunicatorService } from './downgrade/angular-communicator.service';
import { PLCommonComponentsModule } from './common/components';

import { PLCommonServicesModule } from './common/services-ng2';
import { PLPermissionsModule } from './common/auth';

import { PLUserModule } from './modules/user';
import { PLDocumentationClientsModule, PLDocumentationClientsComponent } from '@room/pl-drawers/pl-documentation-drawer/documentation-clients';
import { PLSessionRecordDrawerControlsComponent, PLSessionRecordModule } from '@room/drawers/session-record';

import { PLDrawersModule } from '@room/pl-drawers';
import { PLGamesModule } from './modules/pl-games';
import { PLWidgetsModule } from '@room/pl-widgets';

import { PLCommonOverlaysComponent } from './common/components/pl-common-overlays/pl-common-overlays.component';
import { PLDisclosureComponent } from './common/components/pl-disclosure/pl-disclosure.component';
import { PLSliderComponent } from './common/components/pl-slider/pl-slider.component';

import { PLGameModule } from '../toys/src/modules/game';
import { PLGameComponent } from '../toys/src/modules/game/pl-game.component';
import { PLGameDrawerComponent } from '../toys/src/modules/game/pl-game-drawer.component';
import { PLImageDecksModule } from '@room/pl-image-decks';
import { PLActivitiesComponent } from '@room/pl-image-decks/pl-activities.component';
import { PLImageDecksComponent } from '@room/pl-image-decks/pl-image-decks.component';
import { PLQueueAddModule, PLQueueAddComponent } from './modules/pl-queue/pl-queue-add';
import { PLVideoCaptureModule } from '@modules/room/pl-video-capture';

import { PLInactiveComponent } from './modules/user/pl-inactive/pl-inactive.component';

import {
    currentUserModelProvider,
    appModelProvider,
    firebaseAppModelProvider,
    firebaseModelProvider,
    liveagentServiceProvider,
    activityServiceProvider,
    assessmentServiceProvider,
    applicationServiceProvider,
    tokboxWaitingRoomServiceProvider,
    filteredCanvasServiceProvider,
    waitingRoomHelperServiceProvider,
    iPadSupportServiceProvider,
    lightyearUserFactoryProvider,
    pageTitleModelProvider,
} from './downgrade';

// pl-components-ng2
import {
    PLAppNavModule,
    PLButtonModule,
    PLCarouselModule,
    PLDotLoaderModule,
    PLGraphQLModule,
    PLInputModule,
    PLIconModule,
    PLModalModule,
    PLToastModule,

    PLDialogModule,

    PLHttpModule,
    PipeModule,

    PLLodashService,
    PLTimezoneService,
    PLWindowService,
    PLApiLocationsService,
} from '@root/index';
import { PLWidgetsOverlayService } from '@room/pl-widgets/pl-widgets-overlay/pl-widgets-overlay.service';
import { PLWidgetsBoardModelService } from '@room/pl-widgets/pl-widgets-board/pl-widgets-board-model.service';
import { EffectsModule } from '@ngrx/effects';
import { PLLoaderOverlayComponent } from './common/components/pl-loader-overlay/pl-loader-overlay.component';
import { PLRoomOverlayModule } from '@room/pl-room-overlay';
import { PLTechCheckModule } from './modules/pl-setup/pl-tech-check';
import { PLRoomToolbarModule } from '@room/pl-room-toolbar';
import { RoomEffects } from '@room/store/room.effects';
import { FirebaseEffects } from './common/firebase/store/firebase.effects';
import { SessionEffects } from '@room/session/store';
import { PLStudentSettingsModule } from './modules/student-login/pl-student-settings';
import { FirebaseResolverService } from './common/firebase/proxy-resolver.service';
import { PLWaitingRoomService } from './common/services/pl-waiting-room.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { PLHijackHelperService } from './common/services/pl-hijack.service';
import { PLGlobalUtilService } from './common/services/pl-global-util.service';
import { PLProfileMenuModule } from '@room/pl-profile-menu';
import { extModules } from './build-specifics';
import { PLWorkspaceModule } from './modules/room/pl-workspace';
import { DRFActivityModel } from './common/models/DRF/DRFActivityModel.service';
import { DRFAssessmentModel } from './common/models/DRF/DRFAssessmentModel.service';
import { DRFGameModel } from './common/models/DRF/DRFGameModel.service';
import { DRFRoomModel } from './common/models/DRF/DRFRoomModel.service';
import { ConferenceModule } from './modules/room/conference';
import { AppEffects } from '@room/app/store';
import { MediaEffects } from '@common/media/store';
import { PLWaitingRoomModule } from './modules/waiting-room';
import { LocalStorageService } from './common/services/LocalStorageService';
import { PLStudentLoginModule } from './modules/student-login';
import { PLAppGlobalModule } from './modules/app-global';
import { AppGlobalComponent } from './modules/app-global/app-global.component';
import { RewardAnimationsModule } from './modules/reward-animations';

export function firebaseProxyInitializer(resolver: FirebaseResolverService) {
    return () => resolver.load();
}


@NgModule({
    declarations: [
        AppComponent,
        plLogoutComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        UpgradeModule,
        UIRouterUpgradeModule,
        UIRouterModule.forChild(),
        StoreModule.forRoot(AppStore),
        EffectsModule.forRoot([
            RoomEffects,
            FirebaseEffects,
            SessionEffects,
            AppEffects,
            MediaEffects,
        ]),
        ...extModules,
        HttpClientModule,

        // pl-components-ng2
        PLAppNavModule,
        PLButtonModule,
        PLCarouselModule,
        PLDotLoaderModule,
        PLGraphQLModule,
        PLIconModule,
        PLInputModule,
        PLHttpModule,
        PLDialogModule,
        PLToastModule,
        PLModalModule,

        PLCommonServicesModule,
        PLCommonComponentsModule,

        PLAppGlobalModule,
        PLUserModule,
        PLPermissionsModule,
        PLDocumentationClientsModule,
        PLSessionRecordModule,
        PLGameModule,
        PLImageDecksModule,
        PLQueueAddModule,
        PLDrawersModule,
        PLGamesModule,
        PLWidgetsModule,
        PipeModule,
        PLRoomOverlayModule,
        PLTechCheckModule,
        PLRoomToolbarModule,
        PLStudentSettingsModule,
        PLStudentLoginModule,
        PLProfileMenuModule,
        PLVideoCaptureModule,
        PLWorkspaceModule,
        ConferenceModule,
        PLWaitingRoomModule,
        RewardAnimationsModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: firebaseProxyInitializer,
            multi: true,
            deps: [FirebaseResolverService],
        },
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill',
            },
        },
        AppConfigService,
        PLFeatureFlagsService,
        AngularCommunicatorService,

        CurrentUserService,
        UserAuthGuardService,
        InactivityLogoutService,
        // CanDeactivateGuard,

        PLLodashService,
        PLTimezoneService,
        PLWindowService,
        PLApiLocationsService,

        currentUserModelProvider,
        appModelProvider,
        firebaseAppModelProvider,
        firebaseModelProvider,
        liveagentServiceProvider,
        activityServiceProvider,
        assessmentServiceProvider,
        applicationServiceProvider,
        tokboxWaitingRoomServiceProvider,
        filteredCanvasServiceProvider,
        waitingRoomHelperServiceProvider,
        iPadSupportServiceProvider,
        lightyearUserFactoryProvider,
        pageTitleModelProvider,

        HeapLogger,
        PLWidgetsOverlayService,
        PLWidgetsBoardModelService,
        DRFActivityModel,
        DRFAssessmentModel,
        DRFGameModel,
        DRFRoomModel,
        PLHijackHelperService,
        PLGlobalUtilService,
        PLWaitingRoomService,
        LocalStorageService,
    ],
    entryComponents: [
        PLDotLoaderComponent,
        PLIconComponent,
        PLInputCheckboxComponent,
        AppGlobalComponent,
        PLCommonOverlaysComponent,
        PLDisclosureComponent,
        PLSliderComponent,
        PLDocumentationClientsComponent,
        PLSessionRecordDrawerControlsComponent,
        PLGameComponent,
        PLGameDrawerComponent,
        PLActivitiesComponent,
        PLImageDecksComponent,
        PLQueueAddComponent,
        PLInactiveComponent,
        PLLoaderOverlayComponent,
    ],
})
export class AppModule {
    constructor(
        private upgrade: UpgradeModule,
    ) { }
    ngDoBootstrap() {
        this.upgrade.bootstrap(document.body, [appModuleAngularJS.name], { strictDi: true });
    }
}
