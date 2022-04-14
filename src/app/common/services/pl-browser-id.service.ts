/**
 * Service for accessing the browser ID for this machine
 *
*/
export class BrowserIdService {
    constructor(private guidService) {
    }

    getBrowserId = function() {
        let browserId = localStorage.getItem('pl-browser-id');
        if (!browserId) {
            browserId = this.guidService.generateUUID();
            localStorage.setItem('pl-browser-id', browserId);
        }
        return browserId;
    };
}

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('browserIdService', ['guidService', BrowserIdService]);
