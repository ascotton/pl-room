import { props } from '@ngrx/store';
import { createAction } from '@common/utils';
import { Participant } from './session.model';
export interface UpdateParticipantPayload<T extends Participant> {
    id: string;
    participant: PartialDeep<Omit<T, 'id'>>;
}

export enum SessionActionTypes {
    initObserver = '/session/initObserver',
    addLocal = '/session/addLocal',
    addLocalSuccess = '/session/addLocalSuccess',
    addLocalError = '/session/addLocalError',
    addedRemotely = '/session/addedRemotely',
    updatedRemotely = '/session/updatedRemotely',
    removedRemotely = '/session/removedRemotely',
    setIsViewingPage = '/session/setIsViewingPage',
    setIsViewingPageSuccess = '/session/setIsViewingPageSuccess',
    setIsViewingPageError = '/session/setIsViewingPageError',
    addWaiting = '/session/addWaiting',
    addWaitingSuccess = '/session/addWaitingSuccess',
    addWaitingError = '/session/addWaitingError',
    admit = '/session/admit',
    admitSuccess = '/session/admitSuccess',
    admitError = '/session/admitError',
    studentAdmissionFailed = '/session/studentAdmissionFailed',
    studentAdmissionFailedSetSuccess = '/session/studentAdmissionFailedSetSuccess',
    studentAdmissionFailedSetError = '/session/studentAdmissionFailedSetError',
    kick = '/session/kick',
    kickSuccess = '/session/kickSuccess',
    kickError = '/session/kickError',
    kicked = '/session/kicked',
    removeOfflineSuccess = '/session/removeOfflineSuccess',
    removeOfflineError = '/session/removeOfflineError',
    setYoutubeInteractionPending = '/session/setYoutubeInteractionPending',
    setYoutubeInteractionPendingSuccess = '/session/setYoutubeInteractionPendingSuccess',
    setYoutubeInteractionPendingError = '/session/setYoutubeInteractionPendingError',
    setLocalOffline = '/session/setLocalOffline',
    leave = '/session/leave',
    kickDuplicateds = '/session/kickDuplicateds',
    kickDuplicatedsSuccess = '/session/kickDuplicatedsSuccess',
    kickDuplicatedsError = '/session/kickDuplicatedsError',
}

const initObserver = createAction(
    SessionActionTypes.initObserver,
    props<{ participant: Participant; }>(),
);

const addLocal = createAction(
    SessionActionTypes.addLocal,
    props<{ participant: Participant; }>(),
);

const addLocalSuccess = createAction(
    SessionActionTypes.addLocalSuccess,
    props<{ participant: Participant; }>(),
);

const addLocalError = createAction(
    SessionActionTypes.addLocalError,
    props<{ participant: Participant; error: any; }>(),
);

const addedRemotely = createAction(
    SessionActionTypes.addedRemotely,
    props<{ participant: Participant; }>(),
);

const updatedRemotely = createAction(
    SessionActionTypes.updatedRemotely,
    props<{ id: string; participant: Partial<Participant>; }>(),
);

const removedRemotely = createAction(
    SessionActionTypes.removedRemotely,
    props<{ id: string; }>(),
);

const setIsViewingPage = createAction(
    SessionActionTypes.setIsViewingPage,
    props<{ isViewingPage: boolean; }>(),
);

const setIsViewingPageSuccess = createAction(
    SessionActionTypes.setIsViewingPageSuccess,
    props<{ id: string, isViewingPage: boolean; }>(),
);

const setIsViewingPageError = createAction(
    SessionActionTypes.setIsViewingPageError,
    props<{ isViewingPage: boolean; error: any; }>(),
);

const addWaiting = createAction(
    SessionActionTypes.addWaiting,
    props<{ participant: Participant; }>(),
);

const addWaitingSuccess = createAction(
    SessionActionTypes.addWaitingSuccess,
    props<{ participant: Participant; }>(),
);

const addWaitingError = createAction(
    SessionActionTypes.addWaitingError,
    props<{ participant: Participant; error: any; }>(),
);

const admit = createAction(
    SessionActionTypes.admit,
    props<{ id: string; }>(),
);

const admitSuccess = createAction(
    SessionActionTypes.admitSuccess,
    props<{ id: string; }>(),
);

const admitError = createAction(
    SessionActionTypes.admitError,
    props<{ id: string; error: any; }>(),
);

const studentAdmissionFailed = createAction(
    SessionActionTypes.studentAdmissionFailed,
    props<{ id: string; }>(),
);

const studentAdmissionFailedSetSuccess = createAction(
    SessionActionTypes.studentAdmissionFailedSetSuccess,
    props<{ id: string; }>(),
);

const studentAdmissionFailedSetError = createAction(
    SessionActionTypes.studentAdmissionFailedSetError,
    props<{ id: string; }>(),
);

const kick = createAction(
    SessionActionTypes.kick,
    props<{ id: string; }>(),
);

const kickSuccess = createAction(
    SessionActionTypes.kickSuccess,
    props<{ id: string; }>(),
);

const kickError = createAction(
    SessionActionTypes.kickError,
    props<{ id: string; error: any; }>(),
);

const kicked = createAction(
    SessionActionTypes.kicked,
);

const removeOfflineSuccess = createAction(
    SessionActionTypes.removeOfflineSuccess,
    props<{ id: string; }>(),
);

const removeOfflineError = createAction(
    SessionActionTypes.removeOfflineError,
    props<{ id: string; error: any; }>(),
);

const setYoutubeInteractionPending = createAction(
    SessionActionTypes.setYoutubeInteractionPending,
    props<{ isPending: boolean; }>(),
);

const setYoutubeInteractionPendingSuccess = createAction(
    SessionActionTypes.setYoutubeInteractionPendingSuccess,
    props<{ id: string; isPending: boolean; }>(),
);

const setYoutubeInteractionPendingError = createAction(
    SessionActionTypes.setYoutubeInteractionPendingError,
    props<{ isPending: boolean; error: any; }>(),
);

const setLocalOffline = createAction(
    SessionActionTypes.setLocalOffline,
    props<{ id: string; offline: boolean; }>(),
);

const leave = createAction(
    SessionActionTypes.leave,
);

const kickDuplicateds = createAction(
    SessionActionTypes.kickDuplicateds,
);

const kickDuplicatedsSuccess = createAction(
    SessionActionTypes.kickDuplicatedsSuccess,
);

const kickDuplicatedsError = createAction(
    SessionActionTypes.kickDuplicatedsError,
    props<{ error: any }>(),
);

export const SessionActions = {
    initObserver,
    addLocal,
    addLocalSuccess,
    addLocalError,
    addedRemotely,
    updatedRemotely,
    removedRemotely,
    setIsViewingPage,
    setIsViewingPageSuccess,
    setIsViewingPageError,
    addWaiting,
    addWaitingSuccess,
    addWaitingError,
    admit,
    admitSuccess,
    admitError,
    studentAdmissionFailed,
    studentAdmissionFailedSetSuccess,
    studentAdmissionFailedSetError,
    kick,
    kickSuccess,
    kickError,
    kicked,
    removeOfflineSuccess,
    removeOfflineError,
    setYoutubeInteractionPending,
    setYoutubeInteractionPendingSuccess,
    setYoutubeInteractionPendingError,
    setLocalOffline,
    leave,
    kickDuplicateds,
    kickDuplicatedsSuccess,
    kickDuplicatedsError,
};
