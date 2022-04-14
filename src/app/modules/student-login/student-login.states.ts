
import { studentLoginModule } from './student-login.module';
import { WaitingRoomResolver } from '@common/resolvers/WaitingRoomResolver';

const resolveCurrentUser = function($q, $state, currentUserModel, $stateParams, applications) {
    const deferred = $q.defer();
    // If already logged in (e.g. as therapist), just redirect to room
    // (do NOT allow logging in, a second time, as student).
    if ($stateParams.clinician_username) {
        if (currentUserModel.user.isInGroup('student') || currentUserModel.user.isAuthenticated) {
            // If logged in and not student, send to room without clinician user name.
            if (currentUserModel.user && currentUserModel.user.username === $stateParams.clinician_username) {
                $state.go('room', { clinician_username: '' });
            } else {
                $state.go('room', {
                    clinician_username: $stateParams.clinician_username,
                });
            }
        } else {
            // $http calls get intercepted and redirected to the main
            // (non student) login page. So to stay on this page, we need
            // to make a request that bypasses the $http intercept.
            // We could also alter the login callback in `app.js` but we
            // get a circular dependency when trying to use $state there
            // (AND even if we get around that, $state.current.name is blank)
            // to only attach the login redirect callback if NOT on this student
            // login page.
            // We have to thus replicated the login status check API call WITH
            // the proper credentials.
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const res = JSON.parse(xhr.response);
                        if (res.user && res.user.username === $stateParams.clinician_username) {
                            $state.go('room', { clinician_username: '' });
                        } else {
                            // $state.go('room', {
                            //     clinician_username: $stateParams.clinician_username,
                            // });
                            deferred.resolve(currentUserModel.user);
                        }
                    } else {
                        deferred.resolve(currentUserModel.user);
                    }
                }
            };
            xhr.open('GET', applications.auth.statusUrl);
            xhr.send();
        }
    } else {
        deferred.resolve(currentUserModel.user);
    }
    return deferred.promise;
};

function waitingRoomResolver($q, $http, $state, $stateParams, applications, waitingRoomModel) {
    const clincianName = $stateParams.clinician_username;
    return (new WaitingRoomResolver($q, $http, $state, $stateParams, applications,
                                    waitingRoomModel)).resolveWaitingRoom(clincianName);
}

const studentLoginState = {
    parent: 'app',
    name: 'studentLogin',
    url: '/:clinician_username',
    component: 'plStudentLogin',
    params: { clinician_username: '' },
    resolve: {
        waitingRoom: ['$q', '$http', '$state', '$stateParams', 'applications', 'waitingRoomModel', waitingRoomResolver],
        currentUser: ['$q', '$state', 'currentUserModel', '$stateParams',
            'applications', resolveCurrentUser],
    },
};

studentLoginModule.config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state(studentLoginState);
}]);
