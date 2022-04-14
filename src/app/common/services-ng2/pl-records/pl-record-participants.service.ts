import { Injectable } from '@angular/core';

@Injectable()
export class PLRecordParticipantsService {

    constructor() {}

    findOrFormMatchingRecord(participant, records) {
        let record = Object.assign({}, participant, {
            uuid: null,
            _participantUuid: participant.uuid,
        });
        // If no clients and no locations, just use the (single) record.
        if (participant.noClientNorLocation) {
            if (records.length === 1) {
                record = records[0];
            }
            return record;
        }
        // Client takes priority as there could be multiple records with the
        // same location but clients should always be unique.
        let recordFound;
        if (participant.client_expanded) {
            recordFound = records.find(item => {
              return item.client_expanded
                && item.client_expanded.uuid === participant.client_expanded.uuid;
            });
        } else if (participant.location_expanded) {
            recordFound = records.find(item => {
              return item.location === participant.location_expanded.uuid;
            });
        }
        return recordFound || record;
    }

}