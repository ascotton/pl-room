import { chain, values } from 'lodash';

function removeScheme(url) {
    return url.replace(/http:\/\//, '').replace(/https:\/\//, '');
}

function removePort(url) {
    return url.replace(/:[0-9]{1,5}/, '');
}

function consistentLocalhostHost(url) {
    const localhostRegex = /127\.0\.0\.1/;
    const localhost = 'localhost';
    return url.replace(localhostRegex, localhost);
}

/**
 * What is all of this about? Glad you asked. Even if the baseUrl is set to https://example.com, the server
 * returns urls that are different. Most of the time this is either http://example.com (different scheme) or in
 * the case that the baseUrl is http://localhost:8000, it can return http://127.0.0.1:9000 (notice the host and ports
 * are different). We need to address these differences here.
 * @param  {[type]}  applications [description]
 * @param  {[type]}  url         [description]
 * @return {Boolean}             [description]
 */
function isPresenceLearningUrl(applications, url) {
    const formattedUrl = chain(url)
        .thru(consistentLocalhostHost)
        .thru(removePort)
        .thru(removeScheme)
        .value();
    return values(applications).reduce((isPlUrl, app: any) => {
        let appIsPlUrl = false;
        if (app.url) {
            const baseUrl = chain(app.url)
                .thru(consistentLocalhostHost)
                .thru(removePort)
                .thru(removeScheme)

                // TODO - adding this trailing slash breaks this check in the case of calls to:
                //  https://login.presencetest.com/api/v1/user/generate_client_token/

                // trailing slash is importaint to catch attacks like http://baseurl.unsecurehost.com/steal/creds
                // .thru((u) => `${u}/`)
                .value();

            appIsPlUrl = (/^\/.*/.test(formattedUrl) || formattedUrl.indexOf(baseUrl) > -1);
        }
        return isPlUrl || appIsPlUrl;
    },                                   false);
}

function authInterceptor($injector, $q, applications) {
    let token;
    let uid;
    let onLogoutSet = false;
    const unauthorizedCallbacks = [];

    function handleUnauthorized() {
        unauthorizedCallbacks.forEach(cb => cb());
    }

    const interceptor = {
        onUnauthorized: callback => unauthorizedCallbacks.push(callback),
        request: (config) => {
            const jwtToken = token || $injector.get('currentUserModel').jwt;
            if (jwtToken && isPresenceLearningUrl(applications, config.url)) {
                config.headers.Authorization = `JWT ${jwtToken}`;

                // when django returns resource_uri's it uses the http:// scheme. It doesn't know that it's behind SSL.
                // Until we fix that on the back end, we should just make sure that we always use https://
                if (!(applications.platform.url.indexOf('local') > -1 || applications.platform.url.indexOf(
                        '127.0') > -1)) {
                    config.url = config.url.replace('http://', 'https://');
                }
            }
            return config;
        },
        response: (response) => {
            if (response.config.url.indexOf(applications.auth.statusUrl) >= 0) {
                token = response.data.token;
                const currentUserModel = $injector.get('currentUserModel');

                currentUserModel.jwt = token;

                if (!uid && response.data.user) {
                    // only configure the callback once.
                    // TODO: should/could this be done using providers?
                    if (!onLogoutSet) {
                        currentUserModel.onLogout(() => {
                            uid = undefined;
                            token = undefined;
                        });
                        onLogoutSet = true;
                    }
                    uid = response.data.user.uuid;
                }
                if (uid && response.data.user && uid !== response.data.user.uuid) {
                    // The user has logged in as a new user and the token was refreshed, we need to reload
                    // the browser to make sure that the app is using the new user.
                    // TODO: test, then implement browser refresh with notice and countdown timer.
                    console.log('WRONG USER!');
                }
            }
            return response;
        },
        responseError: (response) => {
            if (response.status === 401) {
                /**
                 * We reuse 401 for multiple purposes. This block is for digital rights authorization failure
                 */
                const currentUserModel = $injector.get('currentUserModel');
                // check the user
                if (currentUserModel.user && !currentUserModel.user.isClinicianOrExternalProvider()) {
                    // check the url
                    if (response.config.url.indexOf('download') > -1) {
                        // handle digital rights mgmt
                        console.log('[AuthInterceptor] Fetching asset url failed. Bad or missing token');
                        const rights_deferred = $q.defer();
                        const rightsMgmtService = $injector.get('rightsMgmtService');
                        if (rightsMgmtService.isResetPending()) {
                            console.error('[AuthInterceptor] unable to fetch protected asset');
                            return $q.reject(response);  // two failed attempts is unrecoverable
                        }
                        // trigger the token reset...
                        rightsMgmtService.resetCredentials(rights_deferred, response);
                        return rights_deferred.promise;
                    }
                }

                /**
                 * We reuse 401 for multiple purposes. This block is for authentication failure
                 */
                if (response.config.url.indexOf(applications.auth.statusUrl) > -1) {
                    handleUnauthorized();
                    return $q.reject('unauthorized');
                }

                const deferred = $q.defer();
                // Get a new token... (cannot inject $http directly as will cause a circular ref)
                $injector.get('$http').get(applications.auth.statusUrl, {
                    withCredentials: true,
                }).then((refreshResponse) => {
                    if (!refreshResponse.data.token) {
                        deferred.reject('unauthorized'); // login failed, redirect to login page.
                        handleUnauthorized();
                    } else {
                        // now let's retry the original request
                        $injector.get('$http')(response.config).then(
                            (retryResponse) => {
                                deferred.resolve(retryResponse);
                            },
                            (err) => {
                                deferred.reject(err); // something went wrong
                            });
                    }
                },      () => {
                    deferred.reject('unauthorized'); // token retry failed, redirect so user can login again
                    handleUnauthorized();
                });
                return deferred.promise; // return the deferred promise
            }
            return $q.reject(response); // not a recoverable error
        },
    };
    return interceptor;
}

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('authInterceptor', ['$injector', '$q', 'applications', authInterceptor]);
