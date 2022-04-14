import { waitingRoomModule } from './waiting-room.module';

// Wrapper helpser service to handle AngularJS state
// TODO: Replace this service with angular routing usage
export class WaitingRoomHelperService {
    static $inject = ['$state', '$stateParams'];

    constructor(private $state, private $stateParams) {
    }

    getClinicianUsername() {
        return this.$stateParams.clinician_username;
    }

    redirectToClinicianRoom = () => {
        this.$state.go('room', {
            clinician_username: this.getClinicianUsername(),
        });
    }

    redirectToStudentLogin() {
        this.$state.go('studentLogin', {
            clinician_username: this.getClinicianUsername(),
        });
    }

    redirectToWaitingRoom(clientName) {
        this.$state.go(
            'waitingRoom',
            {
                clientName,
                clinician_username: this.getClinicianUsername(),
            },
            {
                location : false,
            },
        );
    }
}

waitingRoomModule.service('waitingRoomHelperService', WaitingRoomHelperService);
