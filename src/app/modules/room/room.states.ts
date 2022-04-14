import { roomModule } from './room.module';
import { RoomResolver } from '@common/resolvers/RoomResolver';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { UserActions } from '../user/store';
import { selectFirebaseReady } from '../../common/firebase/store';
import { take } from 'rxjs/operators';
import { FirebaseModel } from '../../common/models/firebase/FirebaseModel';
import { RTParticipant } from './session/store';
import { User } from '../user/user.model';

function resolveCurrentUser(
    $q,
    $state,
    currentUserModel,
    $stateParams,
    $timeout,
    plAppGlobal,
    ngrxStoreService: Store<AppState>,
) {
    const deferred = $q.defer();
    const isStudent = currentUserModel.user.isInGroup('student');
    const isAuthenticated = currentUserModel.user.isAuthenticated;

    if ($stateParams.clinician_username) {
        // We've been admitted to the room or we are already a therapist.
        // TODO: this allows any therapist to login to other therapist's rooms.
        if (isStudent || isAuthenticated) {
            plAppGlobal.setUser(currentUserModel.user);
            ngrxStoreService.dispatch(
                UserActions.set({
                    isAuthenticated,
                    user: currentUserModel.user,
                }),
            );

            if (isStudent) {
                plAppGlobal.setStudentMode();
            }
            if (isAuthenticated) {
                plAppGlobal.setObserverMode();
            }
            deferred.resolve(currentUserModel.user);
            // Otherwise, we need to login as a student.
        } else {
            $timeout(() => {
                $state.go('studentLogin', {
                    clinician_username: $stateParams.clinician_username,
                });
                deferred.reject('unauthenticated');
            });
        }
    } else {
        currentUserModel.getAuthenticatedUser().then(
            (u) => {
                // Strip 'Observer' from users that are in Therapist mode.
                // TODO - this feels hacky... we need to revamp the whole permissions / use mode system.
                if (
                    currentUserModel.user.groups.includes('Observer') ||
                    currentUserModel.user.groups.includes('observer')
                ) {
                    currentUserModel.user.groups =
                        currentUserModel.user.groups.filter(
                            (group: string) =>
                                group.toLowerCase() !== 'observer',
                        );
                }

                currentUserModel.startInactivityLogoutService();
                plAppGlobal.setUser(currentUserModel.user);
                deferred.resolve(u);
            },
            () => {
                deferred.reject('unauthenticated');
            },
        );
    }
    return deferred.promise;
}

function resolveObserver($q, $state, currentUserModel, $stateParams, plAppGlobal, ngrxStoreService) {
    const deferred = $q.defer();
    if ($stateParams.clinician_username) {
        currentUserModel.getAuthenticatedUser().then(
            (u) => {
                // only allow observing if user is in certain group.
                if (u.isInGroup('observer')) {
                    u.groups = ['Observer'];
                    plAppGlobal.setUser(currentUserModel.user);
                    plAppGlobal.setObserverMode();
                    ngrxStoreService.dispatch(
                        UserActions.set({
                            user: {
                                isObserver: true,
                                ...u,
                            },
                            isAuthenticated: true,
                        }),
                    );
                    deferred.resolve(u);
                } else { // otherwise 404
                    $state.go('invalid_observer', {
                        clinician_username: $stateParams.clinician_username,
                    });
                }
            },
            () => deferred.reject('unauthenticated'));
    } else {
        deferred.reject('No clinician username present');
    }
    return deferred.promise;
}

const roomResolver = [
    '$q',
    '$state',
    'currentUser',
    'drfRoomModel',
    'roomnameModel',
    '$stateParams',
    'ngrxStoreService',
    function ($q, $state, CurrentUser, drfRoomModel, roomnameModel, $stateParams, ngrxStoreService) {
        const resolver = new RoomResolver(
            $q,
            $state,
            CurrentUser,
            drfRoomModel,
            roomnameModel,
            $stateParams,
            ngrxStoreService,
        );
        if (!$stateParams.clinician_username || CurrentUser.groups.includes('Observer')) {
            return resolver.resolveRoom(null);
        }
        if (CurrentUser.token) {
            return resolver.resolveRoom(CurrentUser.token);
        }
        return null;
    },
];

const firebaseResolver = [
    'ngrxStoreService',
    'room',
    function (ngrxStoreService: Store<AppState>) {
        return ngrxStoreService.pipe(
            selectFirebaseReady,
            take(1),
        ).toPromise();
    },
];

const duplicatedProviderResolver = [
    'firebaseUser',
    'firebaseModel',
    'currentUser',
    '$state',
    '$stateParams',
    'ngrxStoreService',
    async function (
        _firebaseUser,
        firebaseModel: FirebaseModel,
        currentUser: User,
        $state,
        $stateParams,
        ngrxStoreService: Store<AppState>,
    ) {
        const isStudent = currentUser && currentUser.groups && currentUser.groups.indexOf('student') > -1;
        if (isStudent) {
            return Promise.resolve();
        }

        let participants: RTParticipant[];

        try {
            participants = await getParticipants();
        } catch (err) {
            console.log('Not possible to get participants', err);
            return resolveProvider();
        }

        const duplicates = participants.filter(p => p.userId === currentUser.uuid);

        if (duplicates.length) {
            ngrxStoreService.dispatch(
                UserActions.setId({ id: currentUser.uuid }),
            );
            $state.go('duplicated_provider', {
                clinician_username: $stateParams.clinician_username,
            });
            throw new Error('More than one host in the room');
        }

        return resolveProvider();

        function resolveProvider() {
            ngrxStoreService.dispatch(
                UserActions.set({ user: currentUser, isAuthenticated: true }),
            );
            return Promise.resolve();
        }

        async function getParticipants() {
            const sessionRef = firebaseModel.getFirebaseRef('session');
            const snapshot = await sessionRef.get();

            if (!snapshot.exists()) {
                return [];
            }
            const normalizedVal = snapshot.val();
            const ids = Object.keys(normalizedVal);
            return ids.map(id => snapshotToParticipant(id, normalizedVal[id]));
        }

        function snapshotToParticipant(id: string, val: any): RTParticipant {
            return {
                id,
                ...val,
            };
        }
    },
];

const observeState = {
    parent: 'app',
    name: 'observe',
    url: '/observe/:clinician_username',
    component: 'room',
    resolve: {
        room: roomResolver,
        currentUser: [
            '$q',
            '$state',
            'currentUserModel',
            '$stateParams',
            'plAppGlobal',
            'ngrxStoreService',
            resolveObserver,
        ],
        firebaseUser: firebaseResolver,
    },
};

const roomState = {
    parent: 'app',
    name: 'room',
    url: '/:clinician_username',
    component: 'room',
    params: { },
    resolve: {
        currentUser: ['$q', '$state', 'currentUserModel', '$stateParams', '$timeout',
            'plAppGlobal', 'ngrxStoreService', resolveCurrentUser],
        room: roomResolver,
        firebaseUser: firebaseResolver,
        duplicatedProvider: duplicatedProviderResolver,
    },
};

const duplicatedProviderState = {
    parent: 'app',
    name: 'duplicated_provider',
    url: '/:clinician_username',
    component: 'plDuplicatedProvider',
};

const invalidRoomState = {
    parent: 'app',
    name: 'invalid_room',
    url: '/:clinician_username',
    component: 'invalidRoom',
};

const invalidObserverState = {
    parent: 'app',
    name: 'invalid_observer',
    url: '/observe/:clinician_username',
    component: 'invalidObserver',
};

roomModule.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.when('/newroom', '/');

    $stateProvider.state(invalidRoomState);
    $stateProvider.state(roomState);
    $stateProvider.state(observeState);
    $stateProvider.state(invalidObserverState);
    $stateProvider.state(duplicatedProviderState);
}]);
