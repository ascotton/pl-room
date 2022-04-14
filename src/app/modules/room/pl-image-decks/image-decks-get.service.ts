import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PLHttpService, PLUrlsService } from '@root/index';
import { AppState } from '@root/src/app/store';
import { User } from '@sentry/types';
import { map } from 'rxjs/operators';
import { selectCurrentUser } from '../../user/store';
import { PLImageDeck } from './image-decks.model';

@Injectable()
export class PLImageDecksGetService {

    private user: User;
    constructor(private plUrls: PLUrlsService,
                store: Store<AppState>,
                private plHttp: PLHttpService) {
        store.select(selectCurrentUser).subscribe(_user => this.user = _user);
    }

    getFavorites() {
        const requestUrl = `${this.plUrls.urls.platformFE}/api/v1/activity/`;
        const params = {
            activity_type: 'imageDeck',
            private: false,
            facet: 'favorites',
            favorite__user__uuid: this.user.uuid,
        };
        return this.plHttp.get('', params, requestUrl).pipe(
            map(this.mapDecks),
        );
    }

    getRecentlyUsed() {
        const requestUrl = `${this.plUrls.urls.platformFE}/api/v1/activity/recent/`;
        const params = {
            activity_type: 'imageDeck',
            private: false,
            facet: 'all',
        };
        return this.plHttp.get('', params, requestUrl).pipe(
            map(this.mapDecks),
        );
    }

    getDeck(deckId: number) {
        const url = `${this.plUrls.urls.activity}${deckId}/`;
        const data = {
            id: deckId,
        };
        return this.plHttp.get('', data, url).pipe(
            map(res => this.parseDeck(res)),
        );
    }

    useImageDeck(id: number) {
        const requestUrl = `${this.plUrls.urls.platformFE}/api/v1/activity/${id}/use/`;
        return this.plHttp.put('', {}, requestUrl);
    }

    private mapDecks = (result: any) => {
        let list: PLImageDeck[] = [];
        if (result.results) {
            list = result.results.map(this.parseDeck);
        }
        return list;
    }

    private parseDeck = (item) => {
        const obj = JSON.parse(item.descriptor);
        const imgArr = obj.images ? obj.images : [];
        const images = imgArr.map(({ id, title, url, thumbnail_url, copies }) => {
            return {
                id,
                title,
                url,
                copies,
                thumbnailUrl: thumbnail_url,
            };
        });
        const parsed: PLImageDeck = {
            images,
            id: item.id,
            uuid: item.uuid,
            name: item.name,
            creator: item.owner,
            thumbnailUrl: item.thumbnail_url,
            description: item.description,
        };
        return parsed;
    }
}
