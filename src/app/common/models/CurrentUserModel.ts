import { User, GuestUser, UnauthenticatedUser, } from './users/UserModels';

import { IAngularStatic } from 'angular';
declare var angular: IAngularStatic;

/**
 * Model for the current user data
 */
export class CurrentUserModel {
    static $inject = ['$q', 'applications', 'authenticationService', '$window'];

    _authUrl: any;
    _logoutUrl: any;
    _authenticationService: any;
    _$window: any;
    user: User;
    initialized: boolean;
    _$q: any;
    afterLogoutCallbacks: any[];
    onLogoutCallbacks: any[];
    jwt: string;

    onAuthenticationCallback(arg0: any): any {
        throw new Error('Method not implemented.');
    }
    constructor($q, applications, authenticationService, $window) {
        this.onLogoutCallbacks = [];
        this.afterLogoutCallbacks = [];
        this._$q = $q;
        this._authUrl = applications.auth.statusUrl;
        this._logoutUrl = applications.auth.logoutUrl;
        this._authenticationService = authenticationService;
        this._$window = $window;

        // Our default so that user is not undefined.
        this.user = new GuestUser();
        this.initialized = false;
    }

    /**
     * This will attempt to use the existing cookie to login the user. If a logged in user already exists,
     * it returns the currently logged in user.
     *
     * @return {nothing}
     */
    getAuthenticatedUser(withLearningProfile = false, allowGuest = false) {
        return this._authenticationService.authenticate(0, allowGuest).then((res) => {
            if (res) {
                const { user, token } = res;
                this.user = user;
                this.jwt = token;
                if (this.hasOwnProperty('onAuthenticationCallback')) {
                    this.onAuthenticationCallback(this.user);
                }
                return user;
            }
            return null;
        });
    }

    startInactivityLogoutService() {
      if (!this.initialized) {
        // just in time injection
        const inactivityLogoutService: any = angular.element(document.body)
          .injector()
          .get('inactivityLogoutService');

        inactivityLogoutService.start();
        this.initialized = true;
      }
    }

    useUnauthenticatedUser(params) {
        this.user = new UnauthenticatedUser(params);
    }

    onAuthentication(callback) {
        this.onAuthenticationCallback = callback;
    }

    /**
     * See AuthenticationService.onLogout
     *
     * @param  {Function} callback
     */
    onLogout(callback) {
        this._authenticationService.onLogout(callback);
    }

    /**
     * See AuthenticationService.logoutgit
     */
    logout() {
        return this._authenticationService.logout().then(() => {
            this.user = new GuestUser();
            return this.user;
        });
    }

}

import { commonModelsModule } from './models.module';
commonModelsModule.service('currentUserModel', CurrentUserModel);
