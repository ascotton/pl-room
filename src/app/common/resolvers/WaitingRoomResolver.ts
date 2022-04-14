export class WaitingRoomResolver {

    constructor(private $q, private $http, private $state, private $stateParams, private applications,
                private waitingRoomModel)  {
    }

    resolveWaitingRoom = (clinicianName: string, clientName?: string, browserId?: string) => {
        const deferred = this.$q.defer();
        const url = `${this.applications.platform.url}/api/v1/waitingroom/${clinicianName}/`;
        this.$http({
            url,
            method: 'POST',
            data: {
                client_name: clientName,
                browser_id: browserId,
            },
        }).then(
            (res) => {
                this.waitingRoomModel.value = {
                    clinicianName,
                    tokbox_api_key: res.data.tokbox_api_key,
                    tokbox_session_id: res.data.tokbox_waiting_room_session_id,
                    tokbox_token: res.data.tokbox_waiting_room_token,
                };
                deferred.resolve(res.data);
            },
            (err) => {
                this.$state.go('invalid_room', {
                    clinician_username: this.$stateParams.clinician_username,
                });
                deferred.resolve(err.data);
            }
        );
        return deferred.promise;
    }
}

import { commonResolversModule } from './common-resolvers.module';
commonResolversModule.factory('roomResolver', WaitingRoomResolver);
