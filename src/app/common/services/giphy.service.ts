import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

const giphyKey = 'OArVRbIcBmsAU';
const giphyBaseUrl = 'https://api.giphy.com/v1/gifs';
const searchUrl = `${giphyBaseUrl}/search?api_key=${giphyKey}`;

export interface GiphySearchParams {
    terms: string | string [];
    rating?: 'y' | 'g' | 'pg' | 'pg-13' | 'r';
    offset?: number;
}

export interface GiphySearchResult {
    url: string;
    previewUrl: string;
    previewSmallUrl: string;
}

interface GiphyResult {
    images: {
        downsized: {
            url: string;
        };
        fixed_height: {
            url: string;
        };
        fixed_height_small: {
            url: string;
        };
    };
}

@Injectable({ providedIn: 'root' })
export class GiphyService {
    constructor(
        private http: HttpClient,
    ) {}

    search(params: GiphySearchParams): Observable<GiphySearchResult[]> {
        const { terms, rating, offset } = params;
        const q = Array.isArray(terms) ? terms.join('+') : terms;

        let queryParams = `&q=${q}`;
        if (rating) {
            queryParams += `&rating=${rating}`;
        }
        if (offset) {
            queryParams += `&offset=${offset}`;
        }

        return this.http.get<{ data: GiphyResult[] }>(`${searchUrl}${queryParams}`).pipe(
            map(res => res.data),
            map(list => list.map(gr => ({
                url: gr.images.downsized.url,
                previewUrl: gr.images.fixed_height.url,
                previewSmallUrl: gr.images.fixed_height_small.url,
            }))),
        );
    }

}
