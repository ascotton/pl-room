import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
export function currentUserModelFactory(i: any) {
    return i.get('currentUserModel');
}

export const currentUserModelProvider = {
    provide: CurrentUserModel,
    useFactory: currentUserModelFactory,
    deps: ['$injector'],
};

import { AppModel } from '@common/models/app-model.service';
export function appModelFactory(i: any) {
    return i.get('appModel');
}

export const appModelProvider = {
    provide: AppModel,
    useFactory: appModelFactory,
    deps: ['$injector'],
};

import { FirebaseAppModel } from '@common/models/firebase/firebase-app-model.service';
export function firebaseAppModelFactory(i: any) {
    return i.get('firebaseAppModel');
}

export const firebaseAppModelProvider = {
    provide: FirebaseAppModel,
    useFactory: firebaseAppModelFactory,
    deps: ['$injector'],
};

import { FirebaseModel } from '@common/models/firebase/FirebaseModel';
export function firebaseModelFactory(i: any) {
    return i.get('firebaseModel');
}

export const firebaseModelProvider = {
    provide: FirebaseModel,
    useFactory: firebaseModelFactory,
    deps: ['$injector'],
};

import { LiveagentService } from '@common/services/LiveagentService';
export function liveagentServiceFactory(i: any) {
    return i.get('liveagentService');
}

export const liveagentServiceProvider = {
    provide: LiveagentService,
    useFactory: liveagentServiceFactory,
    deps: ['$injector'],
};

import { ActivityService } from '@root/src/toys/src/modules/activity/activity.service';
export function activityServiceFactory(i: any) {
    return i.get('activityService');
}

export const activityServiceProvider = {
    provide: ActivityService,
    useFactory: activityServiceFactory,
    deps: ['$injector'],
};

import { AssessmentService } from '@root/src/toys/src/modules/assessment/assessment.service';
export function assessmentServiceFactory(i: any) {
    return i.get('assessmentService');
}

export const assessmentServiceProvider = {
    provide: AssessmentService,
    useFactory: assessmentServiceFactory,
    deps: ['$injector'],
};

import { ApplicationService } from '@common/services/ApplicationService';
export function applicationServiceFactory(i: any) {
    return i.get('applications');
}

export const applicationServiceProvider = {
    provide: ApplicationService,
    useFactory: applicationServiceFactory,
    deps: ['$injector'],
};

import { TokboxWaitingRoomService } from '@common/services/tokbox-waiting-room.service';
export function tokboxWaitingRoomServiceFactory(i: any) {
    return i.get('tokboxWaitingRoomService');
}

export const tokboxWaitingRoomServiceProvider = {
    provide: TokboxWaitingRoomService,
    useFactory: tokboxWaitingRoomServiceFactory,
    deps: ['$injector'],
};

import { FilteredCanvasService } from '@common/services/filtered-canvas.service';
export function filteredCanvasServiceFactory(i: any) {
    return i.get('filteredCanvasService');
}

export const filteredCanvasServiceProvider = {
    provide: FilteredCanvasService,
    useFactory: filteredCanvasServiceFactory,
    deps: ['$injector'],
};

import { WaitingRoomHelperService } from '@modules/waiting-room/waiting-room-helper.service';
export function waitingRoomHelperServiceFactory(i: any) {
    return i.get('waitingRoomHelperService');
}

export const waitingRoomHelperServiceProvider = {
    provide: WaitingRoomHelperService,
    useFactory: waitingRoomHelperServiceFactory,
    deps: ['$injector'],
};

import { IPadSupportService } from '@app/common/services/ipad-support.service';
export function iPadSupportServiceFactory(i: any) {
    return i.get('iPadSupportService');
}

export const iPadSupportServiceProvider = {
    provide: IPadSupportService,
    useFactory: iPadSupportServiceFactory,
    deps: ['$injector'],
};

import { LightyearUserFactory } from '@app/common/models/users/lightyear-user-factory.service';
export function lightyearUserFactoryFactory(i: any) {
    return i.get('lightyearUserFactory');
}

export const lightyearUserFactoryProvider = {
    provide: LightyearUserFactory,
    useFactory: lightyearUserFactoryFactory,
    deps: ['$injector'],
};

import { PageTitleModel } from '@app/common/models/PageTitleModel';
export function pageTitleModelFactory(i: any) {
    return i.get('pageTitleModel');
}

export const pageTitleModelProvider = {
    provide: PageTitleModel,
    useFactory: pageTitleModelFactory,
    deps: ['$injector'],
};
