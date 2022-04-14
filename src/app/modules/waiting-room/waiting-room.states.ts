import { waitingRoomModule } from './waiting-room.module';
import CurrentUserResolver from '@common/resolvers/CurrentUserResolver';
import { WaitingRoomResolver } from '@common/resolvers/WaitingRoomResolver';

function waitingRoomResolver($q, $http, $state, $stateParams, applications, waitingRoomModel, currentUser,
                             browserIdService) {
    if (!currentUser.token) {
        const clinicianName = $stateParams.clinician_username;
        const clientName = $stateParams.client_name;
        const resolver = new WaitingRoomResolver($q, $http, $state, $stateParams, applications, waitingRoomModel);
        return resolver.resolveWaitingRoom(clinicianName, clientName, browserIdService.getBrowserId());
    }
}

const waitingRoomState = {
    parent: 'app',
    name: 'waitingRoom',
    url: '/:clinician_username/:client_name',
    params: { clinician_username: '', client_name: '' },
    component: 'plWaitingRoom',
    resolve: {
        currentUser: CurrentUserResolver,
        waitingRoom: ['$q', '$http', '$state', '$stateParams', 'applications', 'waitingRoomModel', 'currentUser', 'browserIdService',
            waitingRoomResolver],
    },
};

waitingRoomModule.config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state(waitingRoomState);
}]);
