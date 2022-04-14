import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { throttle } from 'lodash';
import { selectCurrentUser } from '../../modules/user/store';
import { User } from '../../modules/user/user.model';
import { AppState } from '../../store';
import { PLGlobalUtilService } from './pl-global-util.service';
// boolean
const KEY_STATE_DEV_HIJACK_HIDE = 'dev.hijack-hide';
// boolean
const KEY_STATE_DRAWER_EXPANDED = 'plUiState.assume-login-bar-expanded';
@Injectable()
export class PLHijackHelperService {
    private isHidden = false;
    private isExpanded = false;
    private isHijacked = false;
    constructor(private store: Store<AppState>,
                private plGlobalUtil: PLGlobalUtilService) {
        this.store.select(selectCurrentUser).subscribe((user) => {
            this.isHijacked = this.isUserHijacked(user);
        });
        this.checkForCookieValues();
        window.setInterval(() => this.checkForCookieValues(), 5000);
        window['plHijackUtil'] = {
            hideHijack: this.hideHijack,
        };
    }

    private checkForCookieValues() {
        const hideCookie = this.plGlobalUtil.readCookie(KEY_STATE_DEV_HIJACK_HIDE);
        this.isHidden = hideCookie && hideCookie === 'true';
        const expandedCookie = this.plGlobalUtil.readCookie(KEY_STATE_DRAWER_EXPANDED);
        this.isExpanded = expandedCookie && expandedCookie === 'true';
    }

    isUserHijacked(user: User) {
        return user
            && user.userStatus
            && user.userStatus.plru
            && (user.userStatus.plru !== user.userStatus.sub);
    }

    setDrawerExpand(value = false) {
        this.plGlobalUtil.createCookie(KEY_STATE_DRAWER_EXPANDED, value, 1000);
        this.isExpanded = value;
    }

    get isCurrentUserHijacked() {
        return this.isHijacked;
    }

    get isHijackHidden() {
        return this.isHidden;
    }

    get isDrawerExpanded() {
        return this.isExpanded;
    }

    private hideHijack = (toggle: boolean) => {
        this.plGlobalUtil.createCookie(KEY_STATE_DEV_HIJACK_HIDE, toggle, 1000);
        this.isHidden = toggle;
    }

}
