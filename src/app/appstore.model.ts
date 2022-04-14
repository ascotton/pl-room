import { User } from './modules/user/user.model';

export interface BackLink {
    previousState: any;
}

export interface DocumentationNotes {
    speakingInstanceId: string;
}

export interface AppStore {
    currentUser: User;
  // users: User[];
    backLink: BackLink;
    documentationNotes: DocumentationNotes;
    personas: any[];
    gameGoFish: any;
    gameSceneBuilder: any;
    overlaysStore: any;
    tokboxRecord: any;
    tokboxStore: any;
    drawer: any;
}
