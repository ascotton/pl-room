import { AuthenticatedUser } from './UserModels';
import { commonModelsModule } from '../models.module';
import { PLHttpService, PLGraphQLService } from '@root/src/lib-components';
import { take } from 'rxjs/operators';
/**
 * Responsible for authentication with the Auth backend service.
 */
class AuthenticationService {

    static $inject = ['applications', '$window', '$http', '$q', 'plHttpService', 'plGraphqlService'];
    onLogoutCallbacks: any[];
    afterLogoutCallbacks: any[];
    _applications: any;
    _$window: any;
    _$http: any;
    _$q: any;
    constructor(applications, $window, $http, $q, private plHttp: PLHttpService, private plGraphql: PLGraphQLService) {
        this.onLogoutCallbacks = [];
        this.afterLogoutCallbacks = [];
        this._applications = applications;
        this._$window = $window;
        this._$http = $http;
        this._$q = $q;
    }

    /**
     * [authenticate description]
     * @return {Promise(authUser)} promise for the authentication user object from the Auth backend service.
     */
    authenticate(lastActive = 0, noRedirect = false) {
        let user: AuthenticatedUser;
        let jwtToken: string;
        return this.plHttp.get('status', { lastActive, withCredentials: true }, null, {
            suppressError: true,
        })
            .toPromise()
            .then((res) => {
                const userData = res.user;
                // unpack jwt token for hijack information
                jwtToken = res.token;
                if (jwtToken && window && window.atob) {
                    const userStatusFromJwtToken = JSON.parse(window.atob(jwtToken.split('.')[1]));
                    userData.userStatus = userStatusFromJwtToken;
                }
                user = new AuthenticatedUser(userData);
                return this.plHttp.get('providers', { user: user.uuid }).toPromise();
            })
            .then((res) => {
                user.xProvider = res.results[0];
                return this.plGraphql.query(`query {
                    currentUser {
                        enabledUiFlags
                    }
                }
                `).pipe(
                    take(1),
                ).toPromise();
            })
            .then(
                (res) => {
                    user.xEnabledUiFlags = res.currentUser.enabledUiFlags;
                    return {
                        user,
                        token: jwtToken,
                    };
                },
                (err) => {
                    if (err && err.status === 401 && !noRedirect) {
                        this.login();
                    }
                },
            );
    }

    getStudentToken(name, browserId) {
        return this._$http.post(this._applications.auth.clientTokenUrl, {
            client_name: name,
            browser_id: browserId,
        }).then(
            (response) => {
                const token = response.data.token;
                return token;
            },
            (data, status, headers, config) => {
                console.log('ERROR: ' + data);
                console.log('ERROR: ' + status);
                console.log('ERROR: ' + headers);
                console.log('ERROR: ' + config);
            },
        );
    }

    /**
     * Redirects the user to the login page.
     *
     * @return {301} redirects immediatly.
     */
    login() {
        window.location.href = `${this._applications.auth.loginUrl}?next=${window.location.href}`;
    }

    /**
     * Subscribe to logout events.
     *
     * Called with one parameter, the logout context (See logout)
     *
     * @param  {Function} callback
     */
    onLogout(callback) {
        this.onLogoutCallbacks.push(callback);
    }

    /**
     * Subscribe to after logout events.
     *
     * Fired after logout callbacks have been fired.
     *
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    afterLogout(callback) {
        this.afterLogoutCallbacks.push(callback);
    }

    /**
     * Redirects the browser to the login screen.
     *
     * @return {[type]} [description]
     */
    redirectToAuth() {
        this._$window.location = this._applications.auth.logoutUrl;
    }

    /**
     * Logs the user out of the application.
     *
     * Goes through all registered onLogout callbacks and fires them (and waits for them to complete)
     * Then redirects the user to the auth.logoutUrl
     *
     * @return {promise} which is pointless because of the redirect.
     */
    logout() {
        console.log('logout in authenticationService, onLogoutCallbacks: ', this.onLogoutCallbacks);
        const promises = [];

        // first take care of notifying everyone who has subscribed.
        // NOTE: These fire immediatly, there is no waiting until each callback finishes. Your
        // callback should assume the current user is already logged out from the backend.
        this.onLogoutCallbacks.forEach((callback) => {
            const promise = callback();
            promises.push(this._$q.when(promise).then((a) => {
                return a;
            }));
        });

        const allPromise = this._$q.all(promises).then((a) => {
            return a;
        });
        allPromise.finally(() => {
            const afterPromises = [];
            this.afterLogoutCallbacks.forEach((callback) => {
                const promise = callback();
                afterPromises.push(this._$q.when(promise).then((a) => {
                    return a;
                }));
            });
            return this._$q.all(afterPromises).then((a) => {
                return a;
            });
        });
        return allPromise;
    }
}

commonModelsModule.service('authenticationService', AuthenticationService);
