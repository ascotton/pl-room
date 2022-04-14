import { Injectable } from '@angular/core';

import { CurrentUserModel } from '@common/models/CurrentUserModel';

@Injectable()
export class LoginMonitorService {

    constructor(
        private currentUserModel: CurrentUserModel
    ) {
    }

    start() {
        const loginTime = '' + Date.now();
        localStorage.setItem('pl-login-time', loginTime);
        setInterval(() => {
            const timeCheck = localStorage.getItem('pl-login-time');
            if (timeCheck !== loginTime) {
                console.log('Double login detected, logging out')
                this.currentUserModel.logout();
            }
        }, 1000)
    }
}
