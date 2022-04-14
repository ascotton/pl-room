/**
 * Service for generate a guid
 *
*/
export class GuidService {
    constructor() {
    }

    generateUUID = function() {
        let d = Date.now();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    };
}

import { IAngularStatic } from 'angular';
declare var angular: IAngularStatic;

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('guidService', GuidService);

