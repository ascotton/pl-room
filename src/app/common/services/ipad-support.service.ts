export class IPadSupportService {
    static $inject = ['plAppGlobal', 'currentUserModel'];

    roomGlobal: any;
    isStudent: boolean;
    constructor (plAppGlobal, currentUserModel) {
        this.roomGlobal = plAppGlobal.getWindowGlobal();
        this.isStudent = currentUserModel.user.isInGroup('student');
    }

    isIPad() {
        return this.roomGlobal.isIPadSafari;
    }

    isIPadCheck(devMode = true) {
        let isIPad = false;
        // 2020-08-04: ipad currently has 5 touchpoints
        isIPad = /Apple/.test(navigator.vendor) && !/iPhone/.test(navigator.userAgent) && navigator.maxTouchPoints > 4;
        // Chrome debugging emulating shows iPad and does not pass first check. Check for iPad too.
        if (!isIPad && devMode) {
            isIPad = /iPad/.test(navigator.userAgent);
        }
        return isIPad;
    }

    isIPadStudent() {
        return this.isIPad() && this.isStudent;
    }

    isTouchEvent(evt) {
        return evt.type.startsWith('touch');
    }

    getClientXFromTouchEvent(evt: TouchEvent) {
        if (this.isTouchEvent(evt) && evt.touches && evt.touches.length) {
            return evt.touches[0].clientX;
        }
        return -1;
    }

    getClientYFromTouchEvent(evt: TouchEvent) {
        if (this.isTouchEvent(evt) && evt.touches && evt.touches.length) {
            return evt.touches[0].clientY;
        }
        return -1;
    }

    isAwaitingYoutubeInteraction() {
        return this.roomGlobal.showingYoutubeLootBox || false;
    }
}

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('iPadSupportService', IPadSupportService);
