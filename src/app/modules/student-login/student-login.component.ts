import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { CurrentUserModel } from '../../common/models/CurrentUserModel';
import PageTitleModel from '../../common/models/PageTitleModel';
import LightyearUserFactory from '../../common/models/users/lightyear-user-factory.service';
import { ApplicationService } from '../../common/services/ApplicationService';
import { LocalStorageService } from '../../common/services/LocalStorageService';
import { AppState } from '../../store';
import { CurrentUserService } from '../user/current-user.service';
import { UserActions } from '../user/store';
import { WaitingRoomHelperService } from '../waiting-room/waiting-room-helper.service';

@Component({
    selector: 'pl-student-login',
    templateUrl: 'student-login.component.html',
    styleUrls: ['./student-login.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLStudentLoginComponent {
    clinicianUsername: any;
    username = '';
    currentUser: any;
    waitingRoom: any;
    submitting = false;
    submitted = false;

    isStudent = true;
    enterRoomText = 'Enter Room';
    userUsername = '';

    constructor(
        private currentUserModel: CurrentUserModel,
        private lightyearUserFactory: LightyearUserFactory,
        private localStorageService: LocalStorageService,
        private pageTitleModel: PageTitleModel,
        private applications: ApplicationService,
        private currentUserService: CurrentUserService,
        private ngrxStoreService: Store<AppState>,
        private waitingRoomHelper: WaitingRoomHelperService,
    ) {
        this.currentUserService.isStudentLogin = true;

        // Username is not a legacy thing that we need to support even though the CurrentUserModel.user
        // does not have a username attribute.
        let username;

        try {
            username = localStorageService.get('username');
        } catch (e) {
            console.error('error reading username from localStorageService in StudentLoginController: ', e);
        }

        this.username = username ? username : '';

        this.clinicianUsername = waitingRoomHelper.getClinicianUsername();
        this.pageTitleModel.set('Login');
        this.getUser();
    }

    getUser() {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const res = JSON.parse(xhr.response);
                    this.setUser(res.user);
                }
            }
        };
        xhr.open('GET', (this.applications as any).auth.statusUrl);
        xhr.send();
    }

    setUser(user) {
        this.isStudent = (user && user.groups &&
            user.groups.includes('student')) ? true : false;
        this.enterRoomText = this.isStudent ? 'Enter Room' : 'Enter Room as Student';
        this.userUsername = !this.isStudent ? user.username : '';
    }

    login = (ev) => {
        if (ev) {
            ev.preventDefault();
        }
        if (this.isStudent) {
            this.loginActual();
        } else {
            const url = (this.applications as any).auth.logoutUrl;
            fetch(url, { redirect: 'manual', credentials: 'include' })
                .then(() => {
                    this.loginActual();
                });
        }
    }

    loginActual = () => {
        this.submitting = true;
        this.submitted = true;
        const value = this.username;
        if (!value) {
            this.submitting = false;
            return;
        }
        const name = value.split(' ');

        this.localStorageService.set('username', value);
        const params = {
            first_name: name[0] !== null ? name[0] : value,
            last_name: name.length > 1 ? name[name.length - 1] : '',
        };
        this.lightyearUserFactory.createStudentUser(params)
            .then((user) => {
                this.currentUserModel.user = user;
                this.ngrxStoreService.dispatch(UserActions.set({ user, isAuthenticated: false }));

                this.waitingRoomHelper.redirectToWaitingRoom(value);
            });
    }
}
