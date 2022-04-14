/**
 * Directive for text chat
 *
 * @param $log
 * @constructor
 */
class SessionRecordDrawerController {
    static $inject = ['$scope', 'appModel', 'firebaseAppModel'];
    appModel: any;
    sessionRecordDrawerActive: boolean;
    screenshareElement: any;

    constructor($scope, appModel, firebaseAppModel) {
        this.appModel = appModel;
        $scope.$watch(
                () => appModel.app.activeDrawer,
                (val) => {
                    if (val === 'sessionRecord') {
                        appModel.toggleSessionRecordDrawer(true);
                    }
                },
            );
        $scope.$watch(
            () => firebaseAppModel.app.sessionRecordDrawerActive,
            (val) => {
                this.sessionRecordDrawerActive = val;
            },
        );
    }
}

import { drawersModule } from '../drawers.module';

const sessionRecordDrawer = drawersModule.component('sessionRecordDrawer', {
    template: require('./session-record-drawer.component.html'),
    bindings: {
    },
    controller: SessionRecordDrawerController,
});
