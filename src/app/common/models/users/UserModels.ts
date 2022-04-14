import { GuidService } from '../../services/GuidService';
const guidService = new GuidService();

import * as _ from 'lodash';

/**
 * Model for the current user data
 */
class User {
    uuid: string;
    groups: any[];
    first_name: string;
    last_name: string;
    display_name: string;
    profile: any;
    xProvider?: any;
    xEnabledUiFlags?: any;

    constructor(userData) {
        if (!userData.uuid) {
            throw new Error('Cannot instanitate a user without a uuid');
        }
        this.groups = [];
        this.first_name = '';
        this.last_name = '';

        if (userData) {
            _.each(userData, (value, key) => {
                this[key] = value;
            });
        }
    }

    /**
     * Determines if the current user is a member of the provided group.
     *
     * @param  {String}  groupName
     * @return {Boolean} True if the user is a member of the group.
     */

    isInGroup(groupName) {
        let result = this.groups.some(group => group.toLowerCase() === groupName.toLowerCase());
        if (!result && groupName.toLowerCase() === 'therapist') {
            result = this.groups.some(group => group.toLowerCase() === 'provider');
        }
        return result;
    }

    /**
     * Provides a nicely formatted name of the user. Returns the display_name if available, otherwise
     * first_name + last_name if available,
     * Otherwise returns the first_name if available, otherwise returns 'Unknown'
     * @return {String} [description]
     */
    getName() {
        return this.display_name || this.first_name &&
            this.last_name &&
            `${this.first_name} ${this.last_name}` ||
            this.first_name || 'Unknown';
    }

    getFirstNameLastInitial() {
        const lastInitial = this.last_name.length && this.last_name[0] || '';
        return (`${this.first_name} ${lastInitial}`).trim();
    }

    isClinician() {
        return this.isInGroup('Therapist') || this.isInGroup('Administrator');
    }

    isClinicianOrExternalProvider() {
        return this.isInGroup('Therapist') || this.isInGroup('Administrator') ||
            this.isInGroup('School Staff Providers') || this.isInGroup('Private Practice');
    }

    isAssessmentUser() {
        return this.isClinician() || this.isInGroup('Assessment Users');
    }

}

class AuthenticatedUser extends User {
    isAuthenticated: boolean;
    constructor(userData) {
        super(userData);

        if (!userData || !userData.uuid) {
            // Programming error
            throw new Error('Cannot create an AuthenticatedUser without user data!');
        }

        // Depricated, we can now use typeof(user) === AuthenticatedUser
        this.isAuthenticated = true;
    }
}

class UnauthenticatedUser extends User {
    constructor(userData) {
        super({
            first_name: userData.first_name,
            last_name: userData.last_name,
            uuid: guidService.generateUUID(),
        });
    }
}

class GuestUser extends User {
    constructor() {
        super({
            first_name: 'guest',
            last_name: '',
            uuid: guidService.generateUUID(),
        });
    }
}

export { User, AuthenticatedUser, UnauthenticatedUser, GuestUser };
