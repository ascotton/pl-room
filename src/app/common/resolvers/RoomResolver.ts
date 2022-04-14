export class RoomResolver {
    constructor(
        private $q: angular.IQService,
        private $state: any,
        private CurrentUser: any,
        private drfRoomModel: any,
        private roomnameModel: any,
        private $stateParams: any,
        private ngrxStoreService?: Store<AppState>,
    ) {}

    resolveRoom = (token: string | null) => {
        const deferred = this.$q.defer();
        const rooms = this.drfRoomModel.collectionModel;

        if (
            !this.$stateParams.clinician_username &&
            this.CurrentUser &&
            this.CurrentUser.isAuthenticated
        ) {
            rooms.filter({
                user__userprofile__uuid: this.CurrentUser.uuid,
            });
        } else if (this.$stateParams.clinician_username !== '') {
            rooms.filter({
                user__username: this.$stateParams.clinician_username,
            });
        } else {
            deferred.reject('InvalidRoom');
        }

        let room = null;
        rooms.fetch({}, token).subscribe(
            (res) => {
                if (res.length === 0) {
                    this.$state.go('invalid_room', {
                        clinician_username:
                            this.$stateParams.clinician_username,
                    });
                    deferred.reject('InvalidRoom');
                } else {
                    room = res[0];
                    this.roomnameModel.value = room;
                    // TODO: looks like the room resolver is invoked in other places
                    // so we need to make sure this is called in waiting room as well
                    if (this.ngrxStoreService) {
                        this.ngrxStoreService.dispatch(RoomActions.setSuccess({
                            data: room,
                        }));
                    }
                    deferred.resolve(room);
                }
            },
            (error: any) => {
                if (this.ngrxStoreService) {
                    this.ngrxStoreService.dispatch(RoomActions.setError({
                        error,
                    }));
                }
                deferred.reject('InvalidRoom');
            },
        );
        return deferred.promise;
    }
}

import { commonResolversModule } from './common-resolvers.module';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { RoomActions } from '@modules/room/store';
commonResolversModule.factory('roomResolver', RoomResolver);
