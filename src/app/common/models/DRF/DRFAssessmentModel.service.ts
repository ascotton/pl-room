import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PLUrlsService } from '@root/index';
import { PLHttpService } from '@root/src/lib-components';
import { DRFModel } from './DRFModel.service';

@Injectable()
export class DRFAssessmentModel extends DRFModel {

    constructor(http: PLHttpService, plUrls: PLUrlsService) {
        super(`${plUrls.urls.platformFE}/api/v1/assessment/`, http);
    }

    use(token) {
        if (!this.model.hasOwnProperty('resource_uri')) {
            throw new Error('This model hasn\'t been saved yet.');
        }
        this.setKey('use');
        return this.save({}, token);
    }
}
