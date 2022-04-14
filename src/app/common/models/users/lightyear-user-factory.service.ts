import * as angular from 'angular';

import UserFactory from './UserFactory';
import { StudentUser } from './StudentUser';

export class LightyearUserFactory extends UserFactory {
    constructor($q, applications, authenticationService) {
        super($q, applications, authenticationService);
    }

    /**
     * Creates a new StudentUser user.
     *
     * @return {Promise(GuestUser)}  returns a promise for an new StudentUser user instance.
     */
    createStudentUser(userData) {
        return this._$q((resolve, reject) => {
            try {
                const user = new StudentUser(userData);
                resolve(user);
            } catch (err) {
                reject(err);
            }
        });
    }
}

export default LightyearUserFactory;
import { commonModelsModule } from '../models.module';
commonModelsModule.service(
    'lightyearUserFactory',
    ['$q', 'applications', 'authenticationService', LightyearUserFactory],
);
