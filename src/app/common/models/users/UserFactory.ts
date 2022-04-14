import {
    UnauthenticatedUser, GuestUser,
} from './UserModels';

/**
 * Creates User instances. See User.
 *
 */
class UserFactory {
    _$q: any;
    _authUrl: any;
    _authenticationService: any;
    constructor($q, applications, authenticationService) {
        this._$q = $q;
        this._authUrl = applications.auth.statusUrl;
        this._authenticationService = authenticationService;
    }

    /**
     * Creates a new guest user.
     *
     * @return {Promise(GuestUser)}  returns a promise for an new Guest user instance.
     */
    createGuestUser() {
        return this._$q((resolve, reject) => {
            try {
                const user = new GuestUser();
                resolve(user);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * This will attempt to use the existing cookie to login the user. If the user is not logged in
     * they will be redirected to the login page.
     *
     * @return {Promise(AuthenticatedUser)} returns a promise for a new Authenticated user instance
     */
    createAuthenticatedUser() {
        return this._authenticationService.authenticate();
    }

    /**
     * Creates a new unauthenticated user
     *
     * @param  {Object} params See UnauthenticatedUser
     * @return {Promise(UnauthenticatedUser)}  returns a promise for an new Unauthenticated user instance.
     */
    createUnauthenticatedUser(params) {
        return this._$q((resolve, reject) => {
            try {
                const user = new UnauthenticatedUser(params);
                resolve(user);
            } catch (err) {
                reject(err);
            }
        });
    }
}

export default UserFactory;
import { commonModelsModule } from '../models.module';
commonModelsModule.service('userFactory', ['$q', 'applications', 'authenticationService', UserFactory]);
