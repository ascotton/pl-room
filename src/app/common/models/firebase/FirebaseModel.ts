/**
 * Model encapsulates firebase references
 * @param this.$log
 * @param this.roomnameModel
 */

export class FirebaseModel {
    firebaseRefs = {};
    connected = false;
    longDisconnect: boolean;
    disconnectionTimeout: NodeJS.Timeout;

    constructor(
        private $log,
        private roomnameModel,
        private angularCommunicatorService,
        private ngrxStoreService,
        private firebaseService: FirebaseService,
    ) {}

    /**
     * Gets the current firebase reference by object name
     * @returns {*}
     */
    getFirebaseRef = (name): firebase.database.Reference => {
        return this.firebaseService.getRoomRef(name);
        /* if (this.roomnameModel && this.roomnameModel.value && this.roomnameModel.value.name) {
            const roomname = this.roomnameModel.value.name;
            if (roomname !== undefined && name !== undefined) {
                if (this.firebaseRefs[name] === undefined) {
                    this.firebaseRefs[name] = this.createFirebaseRef(roomname, name);
                }
                return this.firebaseRefs[name];
            }
        } */
    }

    /**
     * Create the firebase ref for a given top level object name
     * @param name
     * @returns firebaseRef
     */
    createFirebaseRef = (roomname, name): firebase.database.Reference => {
        const path = `${roomname}/${name}`;
        const ref = firebase.database().ref(path);
        return ref;
    }

    monitorConnection = (): void => {
        var connectedRef = firebase.database().ref('.info/connected');
        connectedRef.on('value', (snap) => {
            this.handleConnectionUpdate(snap);
        });
        setInterval(() => {
            connectedRef.once('value', (snap) => {
                this.handleConnectionUpdate(snap);
            });
        }, 1000);
    }

    private handleConnectionUpdate(snap: any) {
        if (snap.val() === true) {
            this.connected = true;
            this.longDisconnect = false;
            this.dispatchConnectionStatus();
            clearTimeout(this.disconnectionTimeout);
        } else {
            this.connected = false;
            this.dispatchConnectionStatus();
            this.disconnectionTimeout = setTimeout(() => {
                if (!this.connected) {
                    this.longDisconnect = true;
                    this.dispatchConnectionStatus();
                }
            }, 5000);
        }
    }

    dispatchConnectionStatus = () => {
        this.ngrxStoreService.dispatch({
            type: 'FIREBASE_CONNECTION',
            payload: {
                connected: this.connected,
                longDisconnect: this.longDisconnect,
            },
        });
    }

    login = () => {
        this.setupFirebaseApp();
        return firebase
            .auth()
            .signInWithCustomToken(this.roomnameModel.value.firebase_auth_token)
            .then((user) => {
                this.$log.debug('Firebase authentication success: ', user);
                // wait 10 seconds to begin monitoring to avoid inappropriate bad firebase connection warning
                // being displayed when the page loads slowly
                setTimeout(() => {
                    this.monitorConnection();
                }, 10 * 1000);
            })
            .catch((error) => {
                alert('Unable to sign into firebase');
                this.$log.error('Firebase Login Failed');
                if (error) {
                    this.$log.error(error);
                }
            });
    }

    setupFirebaseApp = () => {
        if (firebase.apps.length === 0) {
            const config = {
                apiKey: this.roomnameModel.value.firebase_app_config.apiKey,
                authDomain:
                    this.roomnameModel.value.firebase_app_config.authDomain,
                databaseURL: this.roomnameModel.value.firebase_baseurl,
                storageBucket:
                    this.roomnameModel.value.firebase_app_config.storageBucket,
                messagingSenderId:
                    this.roomnameModel.value.firebase_app_config
                        .messageSenderId,
            };
            this.$log.info('[FirebaseModel] initializing Firebase: ', config);
            firebase.initializeApp(config);
            this.angularCommunicatorService.roomname =
                this.roomnameModel.value.name;
        } else {
            this.$log.info('[FirebaseModel] firebase app already initialized');
        }
    }
}

import { commonModelsModule } from '../models.module';
import { FirebaseService } from '../../firebase/firebase.service';
commonModelsModule.service(
    'firebaseModel',
    ['$log', 'roomnameModel', 'angularCommunicatorService', 'ngrxStoreService', 'firebaseService', FirebaseModel],
);
