import { Injectable } from '@angular/core';
import { PLUrlsService } from '@root/index';
import { PLHttpService } from '@root/src/lib-components';
import { Observable } from 'rxjs';
import { DRFCollectionService } from './DRFCollection.service';
import { DRFModel } from './DRFModel.service';

@Injectable()
export class DRFRoomModel extends DRFModel {
    public collectionModel: DRFCollectionService;
    constructor(http: PLHttpService, plUrls: PLUrlsService) {
        super(`${plUrls.urls.platformFE}/api/v3/room/`, http);
        this.collectionModel = new DRFCollectionService(`${plUrls.urls.platformFE}/api/v3/room/`, http);
    }
}
