export interface RoomState {
    status: 'loading' | 'success' | 'error';
    data?: Room;
    error?: any;
}

export interface Room {
    created: Date;
    user: string;
    tokbox_session_id: string;
    tokbox_waiting_room_session_id: string;
    tokbox_environment: string;
    tokbox_waiting_room_token: string;
    tokbox_token: string;
    tokbox_api_key: string;
    firebase_auth_token: string;
    firebase_app_config: FirebaseAppConfig;
    firebase_baseurl: string;
    name: string;
    uuid: string;
}

export interface FirebaseAppConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    storageBucket: string;
    messagingSenderId: string;
}
