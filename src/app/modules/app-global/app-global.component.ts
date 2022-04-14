import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppConfigService } from '@app/app-config.service';
import { CurrentUserService } from '@app/modules/user/current-user.service';
import { PLInactiveService } from '@app/modules/user/pl-inactive/pl-inactive.service';

import { HeapLogger } from '@lib-components/logger/heap.service';

import { User } from '@app/modules/user/user.model';
import { selectCurrentUser } from '@app/modules/user/store';
import { AppState } from '@app/store';
import { Subscription } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SvgInlineNgPluginService } from '../../../build/svg-inline-ng-plugin.service';
import { SessionActions } from '@app/modules/room/session/store';
import { CurrentUserModel } from '@app/common/models/CurrentUserModel';
import { Actions, ofType } from '@ngrx/effects';
import { PLWaitingRoomService } from '@app/common/services/pl-waiting-room.service';

@Component({
    selector: 'pl-app-global',
    templateUrl: './app-global.component.html',
    providers: [
        SvgInlineNgPluginService,
    ],
})
export class AppGlobalComponent implements OnInit, OnDestroy {
    title = 'app';

    appConfig: any;

    subscription: Subscription;

    constructor(
        appConfig1: AppConfigService,
        private currentUserService: CurrentUserService,
        private plInactive: PLInactiveService,
        private store: Store<AppState>,
        private heapLogger: HeapLogger,
        private matIconRegistry: MatIconRegistry,
        private domSanitzer: DomSanitizer,
        private svgInlineNgPluginService: SvgInlineNgPluginService,
        private currentUserModel: CurrentUserModel,
        // TODO This needs to be injected in order to be instantiated and start a
        // subscription. We should remove this after waiting room is on ng2+
        plWaitingRoomService: PLWaitingRoomService,
        actions$: Actions,
    ) {
        this.appConfig = appConfig1;

        actions$.pipe(
            ofType(SessionActions.kicked),
        ).subscribe(() => {
            this.currentUserModel.logout();
        });
    }

    ngOnInit() {
        // We want to block an inactive logout if the page was reloaded.
        this.plInactive.clearLastActiveDatetime();
        // Students do not have a log in, so skip.
        if (!this.currentUserService.isStudentLogin) {
            this.currentUserService.checkAndLogin().subscribe();
        }

        this.subscription = this.store.select(selectCurrentUser).subscribe((user) => {
            if (user) {
                this.heapLogger.setUser(user);
                const hijacked  =  this.isHijacked(user);
                this.heapLogger.setIsHijacked(hijacked);
            }
        });
        this.registerPLIcons();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    isHijacked(user: User) {
        return user
        && user.userStatus
        && user.userStatus.plru
        && (user.userStatus.plru !== user.userStatus.sub);
    }

    registerPLIcons() {
        for (const icon in this.svgInlineNgPluginService.svgs) {
            if (Object.prototype.hasOwnProperty.call(this.svgInlineNgPluginService.svgs, icon)) {
                const svg = this.svgInlineNgPluginService.svgs[icon];
                this.matIconRegistry.addSvgIconLiteral(
                    icon,
                    this.domSanitzer.bypassSecurityTrustHtml(svg.html),
                );
            }
        }
    }
}
