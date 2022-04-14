import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, zip } from 'rxjs';

import {
    PLJWTDecoder,
    PLHttpAuthService,
    PLHttpService,
    PLGraphQLService,
} from '@root/index';

import { AppState } from '@app/store';

const userSelfQuery = require('./queries/user-self.graphql');
const lastSeenMutation = require('./queries/last-seen.graphql');

@Injectable()
export class CurrentUserService {
    // isLoggedIn: boolean = false;
    // this ensures that the router can always get the most recent value set, but only once it becomes available at all
    private _isLoggedIn$ = new ReplaySubject(1);
    get isLoggedIn$() { return this._isLoggedIn$.asObservable(); }

    private _jwt$ = new ReplaySubject<PLJWTDecoder>(1);
    get jwt$() { return this._jwt$.asObservable(); }

    // store the URL so we can redirect after logging in
    // redirectUrl: string;
    userCache: any = {};
    jwt: string = '';
    isStudentLogin = false;

    constructor(private plHttp: PLHttpService, private store: Store<AppState>,
                private plHttpAuth: PLHttpAuthService, private plGraphQL: PLGraphQLService) {}

    login() {
        this.plHttpAuth.login();
    }

    logout() {
        this.plHttpAuth.logout();
    }

    getProvider(user: any) {
        return (user && user.xProvider) ? user.xProvider : null;
    }

    getUserPermissions() {
        const authPermissionsObserver = this.plHttp.get('permissions');
        const workplacePermissionsObserver = this.plGraphQL.query(userSelfQuery, {}, {});

        return new Observable((observer: any) => {
            zip(authPermissionsObserver,
                           workplacePermissionsObserver,
                           (authPermissions: any, workplacePermissions: any) => {
                               workplacePermissions.currentUser =  Object.assign({}, workplacePermissions.currentUser, {authPermissions});

                               return workplacePermissions;
                           })
                          .subscribe((res: any) => {
                                  observer.next(res);
                              },
                              (err) => {
                                  // Return as success anyway; will have no permissions.
                                  observer.next({});
                              });
        });
    }

    saveUser(user: any) {
        if (user) {
            this.getUserPermissions()
                .subscribe((res: any) => {
                    user.xPermissions = (res.currentUser && res.currentUser.permissions) || {};
                    user.xGlobalPermissions = (res.currentUser && res.currentUser.globalPermissions) || {};
                    user.xAuthPermissions = (res.currentUser && res.currentUser.authPermissions) || {};
                    user.xEnabledUiFlags = (res.currentUser && res.currentUser.enabledUiFlags) || [];
                    if (user.groups && user.groups.indexOf('Provider') > -1) {
                        this.plHttp.get('providers', { user: user.uuid })
                            .subscribe((res: any) => {
                                if (res.results && res.results.length) {
                                    user.xProvider = res.results[0];
                                }
                                this.userCache = user;
                            });
                    } else {
                        this.userCache = user;
                    }
                });
        }
    }

    status() {
        this.plHttp.get('status', { withCredentials: true })
            .subscribe((res: any) => {
                const { user } = res;
                user.userStatus = new PLJWTDecoder(res.token).payload;
                this.saveUser(user);
            });
    }

    checkAndLogin(lastActive = 0) {
        return new Observable((observer: any) => {
            if (this.userCache.uuid) {
                this._isLoggedIn$.next(true);
                observer.next(true);
            } else {
                return this.plHttp.get('status', { lastActive, withCredentials: true })
                    .subscribe((res: any) => {
                        if (res.user) {
                            const { user } = res;
                            const plToken = new PLJWTDecoder(res.token);

                            user.userStatus = plToken.payload;

                            this.saveUser(res.user);
                            this.jwt = res.token;
                            this._jwt$.next(plToken);
                            this._isLoggedIn$.next(true);
                            observer.next(true);
                        } else {
                            observer.next(false);
                            this.login();
                        }
                    }, (err: any) => {
                        observer.next(false);
                        this.login();
                    });
            }
        });
    }

    updateUserSeen() {
        const vars: any = {};
        return this.plGraphQL.mutate(lastSeenMutation, vars, {});
    }
}
