import { Component, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppModel } from '@common/models/app-model.service';
import { AppState } from '@app/store';
import { combineLatest, Subscription } from 'rxjs';
import { DrawerActions, DrawerNameType, DrawerState, selectDrawer } from '../store';
import { FirebaseAppModel } from '@common/models/firebase/firebase-app-model.service';
import { selectCurrentUser } from '@modules/user/store';
import { selectUnreadCount } from '../pl-chat-drawer/store';
import { matMenuAnimations } from '@angular/material/menu';
interface ToolbarItem {
    id: string;
    drawerName: DrawerNameType;
    iconProps: {
        icon: string;
        size?: number;
    };
    tooltip: string;
    permissions?: string;
    uiFlag?: string;
}

const toolbarItems: ToolbarItem[] = [
    {
        id: 'activities-drawer-button',
        drawerName: 'activities',
        iconProps: {
            icon: 'documentation',
        },
        tooltip: 'Queue',
        permissions: 'PERMS_DEFAULT_PROVIDERS',
    },
    {
        id: 'games-drawer-button',
        drawerName: 'games',
        iconProps: {
            icon: 'gameboard',
        },
        tooltip: 'Games',
        permissions: 'PERMS_DEFAULT_PROVIDERS',
    },
    {
        id: 'teamwrite-drawer-button',
        drawerName: 'teamWrite',
        iconProps: {
            icon: 'team-write',
        },
        tooltip: 'Team Write',
        permissions: 'PERMS_DEFAULT_PROVIDERS',
    },
    {
        id: 'cobrowse-drawer-button',
        drawerName: 'cobrowse',
        iconProps: {
            icon: 'cobrowsing',
        },
        tooltip: 'Site Share & Screen Share',
        permissions: 'PERMS_DEFAULT_PROVIDERS',
    },
    {
        id: 'documentation-drawer-button',
        drawerName: 'document',
        iconProps: {
            icon: 'notes',
        },
        tooltip: 'Documentation',
        permissions: 'Therapist || Administrator',
    },
    {
        id: 'session-record-drawer-button',
        drawerName: 'sessionRecord',
        iconProps: {
            icon: 'video',
        },
        tooltip: 'Session Recordings',
        permissions: 'Therapist || Administrator',
    },
    {
        id: 'homework-drawer-button',
        drawerName: 'homework',
        iconProps: {
            icon: 'homework',
        },
        tooltip: 'Homework',
        permissions: 'PERMS_PL_SLP_PROVIDERS',
        uiFlag: 'homework-app',
    },
    {
        id: 'chat-drawer-button',
        drawerName: 'chat',
        iconProps: {
            icon: 'chat',
        },
        tooltip: 'Chat',
        permissions: 'All',
    },
];

@Component({
    selector: 'pl-right-toolbar',
    templateUrl: 'pl-right-toolbar.component.html',
    styleUrls: ['pl-right-toolbar.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLRightToolbarComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    drawer: DrawerState;
    isStudent: boolean;
    unreadChatCount = 0;
    isHelpDrawerActive = false;

    get isDrawerOpen() {
        return this.drawer && this.drawer.open;
    }

    get items() {
        return toolbarItems;
    }

    get isTokboxRecording() {
        return this.firebaseAppModel.app.tokboxIsRecording;
    }

    constructor(
        private appModel: AppModel,
        private firebaseAppModel: FirebaseAppModel,
        // TODO: Remove the above when the app is fully migrated to use ngrx
        private store: Store<AppState>,
        private cd: ChangeDetectorRef,
    ) {
        matMenuAnimations.transformMenu.definitions.splice(2, 1);
    }

    ngOnInit() {
        this.subscription = combineLatest([
            this.store.select(selectDrawer),
            this.store.select(selectCurrentUser),
            this.store.select(selectUnreadCount),
        ]).subscribe(([drawer, user = {}, unreadChatCount]) => {
            this.drawer = drawer;

            const { groups = [] } = user;
            this.isStudent = groups.includes('student');

            this.unreadChatCount = unreadChatCount;

            this.cd.detectChanges();
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    toggleDrawer() {
        // TODO: Remove this line when the app is fully migrated to use ngrx
        this.appModel.openDrawer(this.drawer.activeName);

        this.store.dispatch(DrawerActions.toggle());
    }

    openDrawer(drawerName: DrawerNameType) {

        if (this.isDrawerActive(drawerName)) {
            return this.toggleDrawer();
        }

        // TODO: Remove this line when the app is fully migrated to use ngrx
        this.appModel.openDrawer(drawerName);

        this.store.dispatch(DrawerActions.open({ drawerName }));
    }

    isDrawerActive(drawerName: DrawerNameType) {
        return drawerName === this.drawer.activeName;
    }

    getItemIconClass(drawerName: DrawerNameType) {
        if (drawerName === 'teamWrite') {
            return 'gray-light teamwrite-icon';
        }

        if (drawerName === 'sessionRecord') {
            return 'gray-light video-icon';
        }
    }

    toggleHelpActive(active: boolean) {
        this.isHelpDrawerActive = active;
    }
}
