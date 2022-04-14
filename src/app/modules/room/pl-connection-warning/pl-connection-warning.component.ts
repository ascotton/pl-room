import { roomModule } from '../room.module';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectIsFirebaseConnected } from '@app/common/firebase/store';
import { switchMap, delay } from 'rxjs/operators';
import { of } from 'rxjs';

class PlConnectionWarningController {
    static $inject = [
        'ngrxStoreService',
        'currentUserModel',
    ];
    appIsOffline = false;
    firebaseDisconnected = false;
    recovering: boolean;
    offlineRecoveryCountdown: NodeJS.Timeout;

    constructor(ngrxStoreService: Store<AppState>, private currentUserModel) {
        $(window).on('offline', () => {
            this.appIsOffline = true;

        });
        $(window).on('online', () => {
            if (this.appIsOffline) {
                clearTimeout(this.offlineRecoveryCountdown);
                this.recovering = true;
                this.offlineRecoveryCountdown = setTimeout(() => {
                    this.recovering = false;
                }, 10*1000)
            }
            this.appIsOffline = false;
        });

        ngrxStoreService.select(selectIsFirebaseConnected).pipe(
            switchMap((isConnected) => {
                const result = of(isConnected);
                if (isConnected) {
                    return result;
                }

                return result.pipe(
                    delay(5000),
                );
            }),
        )
        .subscribe(
            (isConnected) => {
                this.firebaseDisconnected = !isConnected;
            },
        );
    }

    getFirebaseEmailHref = () => {
        let href = 'mailto:asksupport@presencelearning.com?subject=Firebase%20Connection%20Issue&body=';
        href += '%0D%0A%0D%0A--%0D%0AProvider username: ' + this.currentUserModel.user.username;
        return href;
    }
}

roomModule.component('plConnectionWarning', {
    template: require('./pl-connection-warning.component.html'),
    bindings: {
        active: '<',
    },
    controller: PlConnectionWarningController,
});
