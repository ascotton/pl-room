import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuth } from '@root/src/app/modules/user/store';
import { AppState } from '@root/src/app/store';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../../services/ApplicationService';
import { PLHijackHelperService } from '../../services/pl-hijack.service';

@Component({
    selector: 'pl-hijack-drawer',
    templateUrl: 'pl-hijack-drawer.component.html',
    styleUrls: ['./pl-hijack-drawer.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLHijackDrawerComponent implements OnInit, OnDestroy {
    username = '';
    isStudent = false;
    private userSub: Subscription;
    constructor(private hijackHelper: PLHijackHelperService,
                private appService: ApplicationService,
                private store: Store<AppState>) {
        this.userSub = this.store.select(selectAuth).subscribe(({ user, isAuthenticated }) => {
            if (!isAuthenticated) {
                return;
            }
            this.username = user.username;
            this.isStudent = user.groups.indexOf('student') > -1;
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        if (this.userSub) {
            this.userSub.unsubscribe();
        }
    }

    onClickReleaseUser() {
        window.location.href = this.appService['auth'].hijackReleaseUrl;
    }

    onClickTab() {
        const value = !this.isExpanded;
        this.hijackHelper.setDrawerExpand(value);
    }

    get isCurrentUserHijacked() {
        return !this.isStudent && this.hijackHelper.isCurrentUserHijacked;
    }

    get isExpanded() {
        return this.hijackHelper.isDrawerExpanded;
    }

    get isHijackHidden() {
        return this.hijackHelper.isHijackHidden;
    }

}
