/**
 * Manages access to protected digital content
 *
 * @param $log
 * @param $http
 * @param firebaseAppModel
 * @param applications
 * @constructor
 */
class RightsMgmtService {

    static $inject = [
        '$log', '$http', 'applications', 'currentUserModel', 'conferenceService', 'authenticationService', 'ngrxStoreService',
    ];

    assets = {};
    rightsPromise = null;
    response: any;

    constructor(private $log, private $http, private applications,
                private currentUserModel, private conferenceService: ConferenceService,
                private authenticationService, private ngrxStoreService: Store<AppState>) {
    }

    /**
     * Get the transient url to a protected asset given a key, assessment id, and user token. Clinician tokens
     * are their authentication jwt token. student tokens are fetched by clinicians and stored in firebase.
     *
     * A null token implies a call from a clinician who's token is already in the header.
     *
     * @param assessmentId
     * @param assetkey
     * @param token
     * @returns {*|Promise.<T>}
     */
    getProtectedContentUrl(assessmentId, assetkey, token) {
        const url = this.applications.platform.url + '/api/v1/assessment/' + assessmentId +
                    '/download/?url=' + assetkey;
        this.$log.debug('[RightsMgmtService] returning protected url: ' + url);
        const config = {
            url,
            method: 'GET',
        };
        const useToken = this.currentUserModel.user.token;
        if (useToken != null && useToken !== '') {
            config['headers'] = { Authorization: `JWT ${useToken}` };
        }
        return this.$http(config).then((data) => {
            this.assets[assetkey] = data.data.url;
            return this;
        });
    }

    /**
     * Ok here's what happens with this call....
     *
     * 1. If the student tries to get an asset url with a bad token (via getProtectedContentUrl), the call to
     * get the url returns a 401.
     * 2. The authinterceptor then catches that and invokes this method.
     * 3. This sends a tokbox signal with the student's name and browerId
     * 4. On the clinician side, the handleJWTRequests() method in room.component is listening for this signal
     *    and that update will trigger the clinicians app to get a new token
     * 5. The clinician app will signal back the new token
     * 6. Once that is complete the handler here will trigger with a non-null value
     * 7. When we have the new token we'll retry the original request again (see the handler below)
     *
     * (Or you know, we could instead log students into an account, check their perms,
     * return a valid token and avoid all of this.)
     * @param rightsPromise
     * @param response
     */
    resetCredentials(rightsPromise, response) {
        this.rightsPromise = rightsPromise;
        this.response = response;

        const data = JSON.stringify(
            {
                name: this.currentUserModel.user.getName(),
                browserId: this.currentUserModel.user.browserId,
            },
        );

        const subscription = this.conferenceService.onSignalEvent('jwt-update').subscribe((event) => {
            const newToken = event.data;
            if (newToken !== '' && newToken !== undefined) {
                this.response.config['headers'] = { Authorization: `JWT ${newToken}` };
                this.$http(this.response.config).then(this.handleHttpResponse.bind(this));
                subscription.unsubscribe();
            }
        });

        this.conferenceService.signal(data, 'update-jwt');
    }

    /**
     * signal:update-jwt will be sent by RightsMgmtService from a student in the event the student's
     * token has expired and needs a refresh
    **/
    handleJWTRequests() {
        this.conferenceService.onSignalEvent('update-jwt').pipe(
            mergeMap((event) => {
                const data = JSON.parse(event.data);
                const browserId = data.browserId;
                const name = data.name;
                const from = event.from;
                return of(from).pipe(
                    withLatestFrom(this.authenticationService.getStudentToken(name, browserId)),
                );
            }),
            mergeMap(([from, token]) => {
                return this.conferenceService.signal(
                    token,
                    'jwt-update',
                    from,
                );
            }),
        ).subscribe({
            error: (error) => {
                if (error) {
                    console.log(`signal error (${error.name}): ${error.message}`);
                }
            },
        });
    }

    handleHttpResponse(data) {
        const assetkey = this.findKeyFromUrl(data.config.url);
        this.assets[assetkey] = data.data.url;
        this.rightsPromise.resolve(data);
        this.rightsPromise = null;
    }

    findKeyFromUrl(url) {
        this.$log.debug('[RightsMgmtService] parsing url: ', url);
        let assetkey = '';
        const queryindex = url.indexOf('?url=');
        if (queryindex !== -1) {
            assetkey = url.substring(queryindex + 5);
        }
        this.$log.debug('[RightsMgmtService] found key: ', assetkey);
        return assetkey;
    }

    /**
     * This basically sleeps the thread if we've already started one.
     * @returns {boolean}
     */
    isResetPending() {
        if (this.rightsPromise != null) {
            return true;
        }
        return false;
    }
}

import { commonServicesModule } from './common-services.module';
import { ConferenceService } from '@room/conference';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { switchMap, mergeMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
commonServicesModule.service('rightsMgmtService', RightsMgmtService);
