/**
 * Directive for coBrowsing
 *
 * @constructor
 */
class CoBrowseDrawerController {
    static $inject = ['$http', '$window', 'appModel', 'firebaseAppModel', 'applications'];
    roomCreateUrl: string;
    remoteHQCreateUrl: string;
    handlingUnload = false;
    remoteHQLoading: boolean;

    constructor(private $http, $window, private appModel, private firebaseAppModel, applications) {
        this.roomCreateUrl = `${applications.platform.url}/api/v3/cobrowse/rooms/`;
        this.remoteHQCreateUrl = `${applications.platform.url}/api/v1/remotehq/`;

        const handleUnload = () => {
            // this can get called twice by devices that throw both beforeunload and pagehide events
            // (which is most of them), only iPads throw just pagehide
            if (this.handlingUnload) {
                return;
            }
            this.handlingUnload = true;
            this.appModel.app.sameSiteHostUrl = '';
            this.firebaseAppModel.setSameSiteUrl('');

            this.appModel.app.remoteHQHostUrl = '';
            this.firebaseAppModel.setRemoteHQUrl('');

            this.appModel.toggleSiteshare(false);
            this.appModel.toggleRemoteHQ(false);
            this.appModel.toggleScreenshare(false);
        };
        $window.addEventListener('beforeunload', handleUnload);
        $window.addEventListener('pagehide', handleUnload);
    }

    toggleSiteshare() {
        if (this.firebaseAppModel.app.siteshareActive) {
            this.appModel.app.sameSiteHostUrl = '';
            this.firebaseAppModel.setSameSiteUrl('');
        }
        this.firebaseAppModel.app.siteshareActive = !this.firebaseAppModel.app.siteshareActive;
        this.appModel.toggleSiteshare(this.firebaseAppModel.app.siteshareActive);
        if (this.firebaseAppModel.app.siteshareActive) {
            this.getSameSurfUrl();
        }
    }

    toggleRemoteHQ() {
        if (this.firebaseAppModel.app.remoteHQActive) {
            this.appModel.app.remoteHQHostUrl = '';
            this.firebaseAppModel.setRemoteHQUrl('');
            this.firebaseAppModel.app.remoteHQActive = false;
            this.appModel.toggleRemoteHQ(false);
        } else {
            this.remoteHQLoading = true;
            this.$http({
                method: 'POST',
                url: this.remoteHQCreateUrl,
                data : {
                    initial_url: 'https://www.presencelearning.com/room-suggested-resources',
                },
            }).then(
                (response) => {
                    console.log('remoteHQ embedURL: ', response.data.embedURL);
                    console.log('remoteHQ remoteHQInstanceURN: ', response.data.instanceURN);

                    this.remoteHQLoading = false;
                    this.appModel.app.iAmHost = true;
                    this.appModel.app.remoteHQURL = response.data.embedURL;
                    this.appModel.app.remoteHQInstanceURN = response.data.instanceURN;
                    this.firebaseAppModel.app.remoteHQActive = true;
                    this.appModel.toggleRemoteHQ(true);
                },
            );
        }
    }

    toggleScreenshare() {
        this.appModel.toggleScreenshare(!this.firebaseAppModel.app.screenshareActive);
    }

    getSameSurfUrl() {
        this.$http({
            method: 'POST',
            url: this.roomCreateUrl,
            data : {
                initialurl: 'http://www.kiddle.co',
            },
        }).then(
            (response) => {
                this.appModel.app.iAmHost = true;
                this.appModel.app.sameSiteGuestUrl = response.data.publicinvitation;
                this.appModel.app.sameSiteHostUrl = response.data.privateinvitation;
            },
        );
    }

    submitFeedback() {
        const instance = this.appModel.app.remoteHQInstanceURN ? this.appModel.app.remoteHQInstanceURN : 'unopened';
        const url =  `https://docs.google.com/forms/d/e/1FAIpQLSdiflIgvN5RTClDdLSAKhIN_tX4BhgN9p1TFAJLTAVgrQ9yRw/viewform?usp=sf_link`;
        window.open(url, '_blank');
    }

    getHelp() {
        const url =  `https://presencelearning.helpjuice.com/71385-being-a-provider-with-presencelearning/beta-testing-faq`;
        window.open(url, '_blank');
    }

}

import { drawersModule } from '../drawers.module';

const coBrowseDrawerComponent = drawersModule.component('coBrowseDrawer', {
    template: require('./co-browse-drawer.component.html'),
    bindings: {
        user: '<',
    },
    controller: CoBrowseDrawerController,
});
