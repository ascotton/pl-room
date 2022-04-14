import { debounce } from 'lodash';

class SiteshareController {

    static $inject = ['$scope', '$element', '$timeout', '$sce', 'appModel', 'currentUserModel', 'firebaseAppModel', 'remoteHQSrc'];
    sameSiteUrl = '';
    readonly MAX_Siteshare_WIDTH = 1300;
    siteshareActive: false;
    remoteHQActive: false;
    remoteHQURL: any;
    trustedSameSiteUrl: any;
    trustedRemoteHQUrl: any;

    remoteHQSrc: 'WRONG_VALUE';

    scale = 1;

    constructor($scope, private $element, $timeout, private $sce, private appModel, private currentUserModel, firebaseAppModel, remoteHQSrc) {
        this.remoteHQSrc = remoteHQSrc;

        $scope.$watch(
            () => [$element[0].parentElement.offsetWidth, $element[0].parentElement.offsetHeight].join('x'),
            (val) => {
                this.scaleFrames();
            },
          );

        $scope.$watch(
            () => firebaseAppModel.app.remoteHQActive,
            (val) => {
                setTimeout(() => {
                    this.remoteHQActive = val;
                    $scope.$apply();
                    this.scaleFrames();
                });
                setTimeout(() => {
                    this.scaleFrames();
                }, 300);
            },
        );

        $scope.$watch(
            () => firebaseAppModel.app.remoteHQUrl,
            (val) => {
                if (!appModel.app.iAmHost && !currentUserModel.user.isClinicianOrExternalProvider()) {
                    this.remoteHQURL = val;
                    if (this.remoteHQURL) {
                        this.trustedRemoteHQUrl = this.getFullRemoteHQUrl();
                    }
                    this.scaleFrames();
                    setTimeout(() => {
                        this.scaleFrames();
                    }, 300);
                }
            },
        );

        $scope.$watch(
            () => appModel.app.remoteHQURL,
            (val) => {
                if (appModel.app.iAmHost) {
                    this.remoteHQURL = val;
                    this.trustedRemoteHQUrl = this.getFullRemoteHQUrl();
                    firebaseAppModel.setRemoteHQUrl(appModel.app.remoteHQURL);
                    this.scaleFrames();
                }
            },
        );
    }

    scaleFrames() {
        const width = $('#Siteshare').width();
        this.scale = width / this.MAX_Siteshare_WIDTH;
        $('#remoteHQFrame').css('transform', `scale(${this.scale},${this.scale})`);
    }

    getFullRemoteHQUrl() {
        if (this.remoteHQURL !== '') {
            const name = encodeURIComponent(this.currentUserModel.user.getName());
            const role = this.appModel.app.iAmHost ? 'owner' : 'guest';
            const iframeSource = this.remoteHQSrc;
            const url = `${this.remoteHQURL}?iframeSource=${iframeSource}&role=${role}&userName=${name}`;
            return this.$sce.trustAsResourceUrl(url);
        }
        return this.$sce.trustAsResourceUrl('');
    }

}

import { siteshareModule } from './siteshare.module';

const siteshareComponent = siteshareModule.component('siteshare', {
    template: require('./siteshare.component.html'),
    bindings: {
        user: '<',
    },
    controller: SiteshareController,
});
