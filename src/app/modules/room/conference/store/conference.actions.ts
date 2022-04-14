import { props } from '@ngrx/store';
import { createAction } from '@common/utils/create-action';
import { Stream, LocalStream, RemoteStream } from './conference.model';
import { MediaStreamDevices } from '@root/src/app/common/media';
import { LayoutMode } from '@room/app/store';
import { ConferenceStatus } from '@common/conference';

export interface UpdateStreamPayload<T extends Stream> {
    id: string;
    stream: PartialDeep<Omit<T, 'id'>>;
}

export enum ConferenceActionTypes {
    init = '/conference/init',
    initSuccess = '/conference/initSuccess',
    initError = '/conference/initError',
    addLocalPrimary = '/conference/addLocalPrimary',
    addLocalPrimarySuccess = '/conference/addLocalPrimarySuccess',
    addLocalPrimaryError = '/conference/addLocalPrimaryError',
    join = '/conference/join',
    joinSuccess = '/conference/joinSuccess',
    joinError = '/conference/joinError',
    leave = '/conference/leave',
    setDefaultMedia = '/conference/setDefaultMedia',
    mute =  '/conference/mute',
    muteSuccess =  '/conference/muteSuccess',
    muteError =  '/conference/muteError',
    unmute = '/conference/unmute',
    unmuteSuccess = '/conference/unmuteSuccess',
    unmuteError = '/conference/unmuteError',
    show = '/conference/show',
    showSuccess = '/conference/showSuccess',
    showError = '/conference/showError',
    hide = '/conference/hide',
    hideSuccess = '/conference/hideSuccess',
    hideError = '/conference/hideError',
    addRemote = '/conference/addRemote',
    updateRemote = '/conference/updateRemote',
    removeRemote = '/conference/removeRemote',
    removeParticipantStreams = '/conference/removeParticipantStreams',
    removeParticipantStreamsSuccess = '/conference/removeParticipantStreamsSuccess',
    removeParticipantStreamsError = '/conference/removeParticipantStreamsError',
    dismiss = '/conference/dismiss',
    setMicDevice = '/conference/setMicDevice',
    setMicDeviceSuccess = '/conference/setMicDeviceSuccess',
    setMicDeviceError = '/conference/setMicDeviceError',
    mirror = '/conference/mirror',
    unmirror = '/conference/unmirror',
    rotate = '/conference/rotate',
    derotate = '/conference/derotate',
    setDisplayName = '/conference/setDisplayName',
    setDisplayNameSuccess = '/conference/setDisplayNameSuccess',
    setDisplayNameError = '/conference/setDisplayNameError',
    setDisplayNameRemotely = '/conference/setDisplayNameRemotely',
    setVideoDevice = '/conference/setVideoDevice',
    setVideoDeviceSuccess = '/conference/setVideoDeviceSuccess',
    setVideoDeviceError = '/conference/setVideoDeviceError',
    removeOutOfSessionStream = '/conference/removeOutOfSessionStream',
    removeOutOfSessionStreamSuccess = '/conference/removeOutOfSessionStreamSuccess',
    removeOutOfSessionStreamError = '/conference/removeOutOfSessionStreamError',
    setLayoutModeSuccess = '/conference/setLayoutModeSuccess',
    setLayoutModeError = '/conference/setLayoutModeError',
    promote = '/conference/promote',
    promoteSuccess = '/conference/promoteSuccess',
    promoteError = '/conference/promoteError',
    demote = '/conference/demote',
    demoteSuccess = '/conference/demoteSuccess',
    demoteError = '/conference/demoteError',
    setIsPromotedRemotely = '/conference/setIsPromotedRemotely',
    removeLocalSecondary = '/conference/removeLocalSecondary',
    removeLocalSecondarySuccess = '/conference/removeLocalSecondarySuccess',
    removeLocalSecondaryError = '/conference/removeLocalSecondaryError',
    addLocalSecondary = '/conference/addLocalSecondary',
    addLocalSecondarySuccess = '/conference/addLocalSecondarySuccess',
    addLocalSecondaryError = '/conference/addLocalSecondaryError',
    setIsMutedRemotely = '/conference/setIsMutedRemotely',
    cover = '/conference/cover',
    coverSuccess = '/conference/coverSuccess',
    coverError = '/conference/coverError',
    uncover = '/conference/uncover',
    uncoverSuccess = '/conference/uncoverSuccess',
    uncoverError = '/conference/uncoverError',
    setIsCoveredRemotely = '/conference/setIsCoveredRemotely',
    startScreenshotting = '/conference/startScreenshotting',
    stopScreenshotting = '/conference/stopScreenshotting',
    startCapturing = '/conference/startCapturing',
    stopCapturing = '/conference/stopCapturing',
    setConferenceStatus = '/conference/setConferenceStatus',
}

const init = createAction(
    ConferenceActionTypes.init,
);

const initSuccess = createAction(
    ConferenceActionTypes.initSuccess,
);

const initError = createAction(
    ConferenceActionTypes.initError,
    props<{ error: any; }>(),
);

const setConferenceStatus = createAction(
    ConferenceActionTypes.setConferenceStatus,
    props<{ status: ConferenceStatus; }>(),
);

const addLocalPrimarySuccess = createAction(
    ConferenceActionTypes.addLocalPrimarySuccess,
    props<{ stream: LocalStream; }>(),
);

const addLocalPrimaryError = createAction(
    ConferenceActionTypes.addLocalPrimaryError,
    props<{ stream: LocalStream; error: any; }>(),
);

const join = createAction(
    ConferenceActionTypes.join,
    props<{ id: string }>(),
);

const joinSuccess = createAction(
    ConferenceActionTypes.joinSuccess,
    props<{ id: string }>(),
);

const joinError = createAction(
    ConferenceActionTypes.joinError,
    props<{ id: string; error: any }>(),
);

const leave = createAction(
    ConferenceActionTypes.leave,
    props<{ id: string; }>(),
);

const setDefaultMedia = createAction(
    ConferenceActionTypes.setDefaultMedia,
    props<{ id: string;  devices: MediaStreamDevices }>(),
);

const mute = createAction(
    ConferenceActionTypes.mute,
    props<{ id: string; }>(),
);

const muteSuccess = createAction(
    ConferenceActionTypes.muteSuccess,
    props<{ id: string; }>(),
);

const muteError = createAction(
    ConferenceActionTypes.muteError,
    props<{ id: string; error: any; }>(),
);

const unmute = createAction(
    ConferenceActionTypes.unmute,
    props<{ id: string; }>(),
);

const unmuteSuccess = createAction(
    ConferenceActionTypes.unmuteSuccess,
    props<{ id: string; }>(),
);

const unmuteError = createAction(
    ConferenceActionTypes.unmuteError,
    props<{ id: string; }>(),
);

const show = createAction(
    ConferenceActionTypes.show,
    props<{ id: string; }>(),
);

const showSuccess = createAction(
    ConferenceActionTypes.showSuccess,
    props<{ id: string; }>(),
);

const showError = createAction(
    ConferenceActionTypes.showError,
    props<{ id: string; error: any; }>(),
);

const hide = createAction(
    ConferenceActionTypes.hide,
    props<{ id: string; }>(),
);

const hideSuccess = createAction(
    ConferenceActionTypes.hideSuccess,
    props<{ id: string; }>(),
);

const hideError = createAction(
    ConferenceActionTypes.hideError,
    props<{ id: string; }>(),
);

const addRemote = createAction(
    ConferenceActionTypes.addRemote,
    props<{ stream: RemoteStream; }>(),
);

const updateRemote = createAction(
    ConferenceActionTypes.updateRemote,
    props<UpdateStreamPayload<RemoteStream>>(),
);

const removeRemote = createAction(
    ConferenceActionTypes.removeRemote,
    props<{ id: string }>(),
);

const removeParticipantStreams = createAction(
    ConferenceActionTypes.removeParticipantStreams,
    props<{ participantId: string }>(),
);

const removeParticipantStreamsSuccess = createAction(
    ConferenceActionTypes.removeParticipantStreamsSuccess,
    props<{ participantId: string }>(),
);

const removeParticipantStreamsError = createAction(
    ConferenceActionTypes.removeParticipantStreamsError,
    props<{ participantId: string; error: any }>(),
);

const dismiss = createAction(
    ConferenceActionTypes.dismiss,
    props<{ id: string }>(),
);

const setMicDevice = createAction(
    ConferenceActionTypes.setMicDevice,
    props<{ participantId: string; micDevice: string }>(),
);

const setMicDeviceSuccess = createAction(
    ConferenceActionTypes.setMicDeviceSuccess,
    props<{ streamId: string; micDevice: string }>(),
);

const setMicDeviceError = createAction(
    ConferenceActionTypes.setMicDeviceError,
    props<{ streamId: string; micDevice: string; error: any }>(),
);

const mirror = createAction(
    ConferenceActionTypes.mirror,
    props<{ id: string; }>(),
);

const unmirror = createAction(
    ConferenceActionTypes.unmirror,
    props<{ id: string; }>(),
);

const rotate = createAction(
    ConferenceActionTypes.rotate,
    props<{ id: string; }>(),
);

const derotate = createAction(
    ConferenceActionTypes.derotate,
    props<{ id: string; }>(),
);

const setDisplayName = createAction(
    ConferenceActionTypes.setDisplayName,
    props<{ id: string; displayName: string }>(),
);

const setDisplayNameSuccess = createAction(
    ConferenceActionTypes.setDisplayNameSuccess,
    props<{ id: string; displayName: string }>(),
);

const setDisplayNameError = createAction(
    ConferenceActionTypes.setDisplayNameError,
    props<{ id: string; displayName: string; error: any }>(),
);

const setDisplayNameRemotely = createAction(
    ConferenceActionTypes.setDisplayNameRemotely,
    props<{ id: string; displayName: string }>(),
);

const setVideoDevice = createAction(
    ConferenceActionTypes.setVideoDevice,
    props<{ id: string; videoDevice: string }>(),
);

const setVideoDeviceSuccess = createAction(
    ConferenceActionTypes.setVideoDeviceSuccess,
    props<{ id: string; videoDevice: string }>(),
);

const setVideoDeviceError = createAction(
    ConferenceActionTypes.setVideoDeviceError,
    props<{ id: string; videoDevice: string; error: any }>(),
);

const removeOutOfSessionStream = createAction(
    ConferenceActionTypes.removeOutOfSessionStream,
    props<{ id: string; }>(),
);

const removeOutOfSessionStreamSuccess = createAction(
    ConferenceActionTypes.removeOutOfSessionStreamSuccess,
    props<{ id: string; }>(),
);

const removeOutOfSessionStreamError = createAction(
    ConferenceActionTypes.removeOutOfSessionStreamError,
    props<{ id: string; error: any }>(),
);

const setLayoutModeSuccess = createAction(
    ConferenceActionTypes.removeOutOfSessionStreamSuccess,
    props<{ layoutMode: LayoutMode; }>(),
);

const setLayoutModeError = createAction(
    ConferenceActionTypes.setDisplayNameError,
    props<{ layoutMode: LayoutMode; error: any }>(),
);

const promote = createAction(
    ConferenceActionTypes.promote,
    props<{ id: string; }>(),
);

const promoteSuccess = createAction(
    ConferenceActionTypes.promoteSuccess,
    props<{ id: string; }>(),
);

const promoteError = createAction(
    ConferenceActionTypes.promoteError,
    props<{ id: string; }>(),
);

const demote = createAction(
    ConferenceActionTypes.demote,
    props<{ id: string; }>(),
);

const demoteSuccess = createAction(
    ConferenceActionTypes.demoteSuccess,
    props<{ id: string; }>(),
);

const demoteError = createAction(
    ConferenceActionTypes.demoteError,
    props<{ id: string; }>(),
);

const setIsPromotedRemotely = createAction(
    ConferenceActionTypes.setIsPromotedRemotely,
    props<{ id: string; isPromoted: boolean }>(),
);

const removeLocalSecondary = createAction(
    ConferenceActionTypes.removeLocalSecondary,
);

const removeLocalSecondarySuccess = createAction(
    ConferenceActionTypes.removeLocalSecondarySuccess,
    props<{ id: string; }>(),
);

const removeLocalSecondaryError = createAction(
    ConferenceActionTypes.removeLocalSecondaryError,
    props<{ id: string; }>(),
);

const addLocalSecondary = createAction(
    ConferenceActionTypes.addLocalSecondary,
    props<{ videoDeviceId: string; }>(),
);

const addLocalSecondarySuccess = createAction(
    ConferenceActionTypes.addLocalSecondarySuccess,
    props<{ stream: LocalStream; }>(),
);

const addLocalSecondaryError = createAction(
    ConferenceActionTypes.addLocalSecondaryError,
    props<{ stream: LocalStream; error: any }>(),
);

const setIsMutedRemotely = createAction(
    ConferenceActionTypes.setIsMutedRemotely,
    props<{ id: string; isMuted: boolean }>(),
);

const cover = createAction(
    ConferenceActionTypes.cover,
    props<{ id: string; }>(),
);

const coverSuccess = createAction(
    ConferenceActionTypes.coverSuccess,
    props<{ id: string; }>(),
);

const coverError = createAction(
    ConferenceActionTypes.coverError,
    props<{ id: string; error: any; }>(),
);

const uncover = createAction(
    ConferenceActionTypes.uncover,
    props<{ id: string; }>(),
);

const uncoverSuccess = createAction(
    ConferenceActionTypes.uncoverSuccess,
    props<{ id: string; }>(),
);

const uncoverError = createAction(
    ConferenceActionTypes.uncoverError,
    props<{ id: string; }>(),
);

const setIsCoveredRemotely = createAction(
    ConferenceActionTypes.setIsCoveredRemotely,
    props<{ id: string; isCovered: boolean }>(),
);

const startScreenshotting = createAction(
    ConferenceActionTypes.startScreenshotting,
    props<{ id: string; }>(),
);

const stopScreenshotting = createAction(
    ConferenceActionTypes.stopScreenshotting,
);

const startCapturing = createAction(
    ConferenceActionTypes.startCapturing,
    props<{ id: string; }>(),
);

const stopCapturing = createAction(
    ConferenceActionTypes.stopCapturing,
);

export const ConferenceActions = {
    init,
    initSuccess,
    initError,
    setConferenceStatus,
    addLocalPrimarySuccess,
    addLocalPrimaryError,
    join,
    joinSuccess,
    joinError,
    leave,
    setDefaultMedia,
    mute,
    muteSuccess,
    muteError,
    unmute,
    unmuteSuccess,
    unmuteError,
    show,
    showSuccess,
    showError,
    hide,
    hideSuccess,
    hideError,
    addRemote,
    updateRemote,
    removeRemote,
    removeParticipantStreams,
    removeParticipantStreamsSuccess,
    removeParticipantStreamsError,
    dismiss,
    setMicDevice,
    setMicDeviceSuccess,
    setMicDeviceError,
    mirror,
    unmirror,
    rotate,
    derotate,
    setDisplayName,
    setDisplayNameSuccess,
    setDisplayNameError,
    setDisplayNameRemotely,
    setVideoDevice,
    setVideoDeviceSuccess,
    setVideoDeviceError,
    setLayoutModeSuccess,
    setLayoutModeError,
    removeOutOfSessionStream,
    removeOutOfSessionStreamSuccess,
    removeOutOfSessionStreamError,
    promote,
    promoteSuccess,
    promoteError,
    demote,
    demoteSuccess,
    demoteError,
    setIsPromotedRemotely,
    removeLocalSecondary,
    removeLocalSecondarySuccess,
    removeLocalSecondaryError,
    addLocalSecondary,
    addLocalSecondarySuccess,
    addLocalSecondaryError,
    setIsMutedRemotely,
    cover,
    coverSuccess,
    coverError,
    uncover,
    uncoverSuccess,
    uncoverError,
    setIsCoveredRemotely,
    startScreenshotting,
    stopScreenshotting,
    startCapturing,
    stopCapturing,
};
