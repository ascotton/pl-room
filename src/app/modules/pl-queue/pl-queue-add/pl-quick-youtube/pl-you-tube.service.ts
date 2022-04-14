import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class PLYouTubeService {

    readonly youtubeAPIkey = 'AIzaSyBpXfscTZy4Ap6eaVV2UGwwVX1mn5e59HI';
    readonly baseSearchByIdURL = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,player&key=${this.youtubeAPIkey}`;

    public readonly NO_RESULTS = 'NO_RESULTS';

    constructor() {}

    youTubeGetID(url) {
        let ID = '';
        const parts = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if (parts[2] !== undefined) {
            ID = parts[2].split(/[^0-9a-z_\-]/i);
            ID = ID[0];
        } else {
            ID = url;
        }
        return ID;
    }

    youTubeIDSearch = function(query) {
        return new Observable((observer: any) => {
            const id = this.youTubeGetID(query);
            const searchURL = `${this.baseSearchByIdURL}&id=${id}`;

            // execute request
            const searchRequest = new XMLHttpRequest();
            searchRequest.open('GET', searchURL, true);
            searchRequest.onload = () => {
                let results;
                if (searchRequest.readyState === 4 && searchRequest.status === 200) {
                    results = JSON.parse(searchRequest.responseText);
                    if (results.items.length === 0) {
                        observer.next(this.NO_RESULTS);
                    } else {
                        observer.next(results.items[0]);
                    }
                    observer.complete();
                }
            };
            searchRequest.onerror = function (e) {
                console.error(searchRequest.statusText, e);
                observer.error();
            };
            searchRequest.send();
        });
    };
}
