import { Injectable } from '@angular/core';
import { PLUrlsService } from '@root/index';
import { PLHttpService } from '@root/src/lib-components';
import { Observable } from 'rxjs';
import { DRFModel } from './DRFModel.service';

@Injectable()
export class DRFGameModel extends DRFModel {

    constructor(http: PLHttpService, plUrls: PLUrlsService) {
        super(`${plUrls.urls.platformFE}/api/v1/game/`, http);
    }

    use(token) {
        if (!this.model.hasOwnProperty('resource_uri')) {
            throw new Error('This model hasn\'t been saved yet.');
        }
        this.setKey('use');
        return this.save({}, token);
    }
}
