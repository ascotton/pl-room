import { UnauthenticatedUser } from './UserModels';

class StudentUser extends UnauthenticatedUser {
    constructor(params) {
        super(params);
        this.groups.push('student');
    }
}

export { StudentUser };
