import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseCollection, Update } from '@common/firebase/firebase-collection';
import { FirebaseService } from '@common/firebase/firebase.service';
import { Stream, RTStream } from './store';

@Injectable({ providedIn: 'root' })
export class ConferenceRTService {

    private conferenceRef: FirebaseCollection<RTStream>;

    constructor(
        firebaseService: FirebaseService,
    ) {
        this.conferenceRef = new FirebaseCollection<RTStream>(
            firebaseService.getLazyRoomRef('conference'),
        );
    }

    onStreamAdded() {
        return this.conferenceRef.onAdded().pipe(
            map(rtStream => this.fromRTStream(rtStream)),
        );
    }

    onStreamChanged() {
        return this.conferenceRef.onChanged();
    }

    onStreamRemoved() {
        return this.conferenceRef.onRemoved();
    }

    addStream(stream: Stream) {
        const data = this.toRTStream(stream);
        return this.conferenceRef.add(data);
    }

    updateStream(id: string, changes: Update<Stream>) {
        const data = this.toRTStreamChanges(changes);
        if (!Object.keys(data).length) {
            return of(changes);
        }
        return this.conferenceRef.update(id, data);
    }

    removeStream(id: string) {
        return this.conferenceRef.remove(id);
    }

    removeMultipleStreams(ids: string[]) {
        return this.conferenceRef.bulkRemove(ids);
    }

    updateMultipleStreams(changes: Record<string, Update<Stream>>) {
        const requests = {};
        Object.keys(changes).forEach((a) => {
            const data = this.toRTStreamChanges(changes[a]);
            requests[a] = this.conferenceRef.update(a, data);
        });
        return forkJoin(requests);
    }

    private fromRTStream({ video, microphone, ...generalFields }: RTStream) {
        const result: Stream = {
            ...generalFields,
            video: {
                ...video,
                effects: {
                    isCovered: video && video.effects && video.effects.isCovered,
                    isMirrored: false,
                    isRotated: false,
                },
            },
        };

        if (microphone) {
            result.microphone = {
                ...microphone,
            };
        }

        return result;
    }

    private toRTStream<T extends Stream>(stream: T) {
        const {
            id,
            type,
            isPromoted,
            displayName,
            participantId,
            video,
            microphone,
        } = stream;

        const result: RTStream = {
            id,
            type,
            isPromoted,
            displayName,
            participantId,
            video: {
                isHidden: video.isHidden,
                effects: {
                    isCovered: video.effects && video.effects.isCovered,
                },
            },
        };

        if (microphone) {
            result.microphone = {
                isMuted: microphone.isMuted,
            };
        }

        return this.removeUndefinedValues(result);
    }

    private toRTStreamChanges(changes: PartialDeep<Stream>) {
        const {
            id,
            type,
            isPromoted,
            displayName,
            participantId,
            video,
            microphone,
        } = changes;

        const result: PartialDeep<RTStream> = {
            id,
            type,
            isPromoted,
            displayName,
            participantId,
        };

        if (video) {
            result.video = {
                isHidden: video.isHidden,
                effects: {
                    isCovered: video.effects && video.effects.isCovered,
                },
            };
        }

        if (microphone) {
            result.microphone = {
                isMuted: microphone.isMuted,
            };
        }

        return this.removeUndefinedValues(result);
    }

    private removeUndefinedValues<T>(obj: T) {
        return JSON.parse(JSON.stringify(obj)) as T;
    }
}
