import { User } from './common/models/users/UserModels';
import { DrawerState } from '@modules/room/pl-drawers/store';
import { UserState } from '@modules/user/store';
import { ChatState } from '@modules/room/pl-drawers/pl-chat-drawer/store';
import { GameState } from './modules/pl-games/store';

import { documentationNotes, DocumentationNotes } from './stores/documentation-notes.store';
import { personas } from './stores/personas.store';
import { gameGoFish } from './stores/game-go-fish.store';
import { gameSceneBuilder } from './stores/game-scenes.store';
import { overlaysStore } from './stores/overlays.store';
import { tokboxRecord } from './stores/tokbox-record.store';
import { tokboxStore } from './stores/tokbox.store';
import { firebaseStateStore } from './stores/firebase-state.store';
import { teamWriteStore } from './stores/team-write.store';
import { ConferenceState } from '@room/conference/store';
import { SessionState, reducer as sessionReducer } from '@room/session/store';
import { RoomState, reducer as roomReducer } from '@room/store';
import { FirebaseState, reducer as firebaseReducer } from './common/firebase/store';
import { ProfileMenuState, reducer as profileMenuReducer } from './modules/room/pl-profile-menu/store';
import { AppConfigState, reducer as appReducer } from './modules/room/app/store';
import { MediaState, reducer as mediaReducer } from '@common/media/store';
import { ScreenshareState } from '@room/conference/screenshare/store';

export interface AppState {
    drawer: DrawerState;
    currentUser: User;
    auth: UserState;
    chat: ChatState;
    documentationNotes: DocumentationNotes;
    personas: any[];
    gameGoFish: any;
    gameSceneBuilder: any;
    overlaysStore: any;
    tokboxRecord: any;
    tokboxStore: any;
    game: GameState;
    session: SessionState;
    conference: ConferenceState;
    app: AppConfigState;
    room: RoomState;
    firebase: FirebaseState;
    profileMenu: ProfileMenuState;
    media: MediaState;
    screenshare: ScreenshareState;
}

const store = {
    documentationNotes,
    personas,
    gameGoFish,
    gameSceneBuilder,
    overlaysStore,
    tokboxRecord,
    tokboxStore,
    teamWriteStore,
    firebaseStateStore,
    session: sessionReducer,
    app: appReducer,
    room: roomReducer,
    firebase: firebaseReducer,
    profileMenu: profileMenuReducer,
    media: mediaReducer,
};

export default store;
