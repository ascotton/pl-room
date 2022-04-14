import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PLHttpService } from '@root/src/lib-components';
import { map } from 'rxjs/operators';
import { DRFModel } from './DRFModel.service';

@Injectable()
export class DRFCollectionService {
    value: DRFModel[] = [];
    private _filter: any = {};
    private _orderBy = '';
    private apiUrl: string;
    totalPages = 0;
    currentPage = 0;
    length = 0;
    limit = 0;
    totalCount: number;
    offset = 0;
    constructor(apiUrl, private http: PLHttpService) {
        this.apiUrl = apiUrl;
    }

    filter(obj) {
        Object.keys(obj).forEach((key) => {
            if (obj[key]) {
                this._filter[key] = obj[key];
            } else {
                delete this._filter[key];
            }
        });
        return this.value;
    }

    fetch(obj, token) {
        let params = { ...this._filter };
        params.limit = this.limit;
        params.offset = this.offset;
        if (this._orderBy !== null) {
            params.order_by = this._orderBy;
        }
        params = Object.assign(params, obj);

        const url = this.apiUrl;
        let httpParams = new HttpParams();
        Object.keys(params).forEach((key) => {
            httpParams = httpParams.set(key, params[key]);
        });

        return this.http.get('', params, url, { jwtToken: token })
            .pipe(
                map((u: any) => {
                    if (u) {

                        this.limit = u.limit;
                        this.totalCount = u.count;
                        if (u.offset) {
                            this.currentPage = Math.floor(u.offset / u.limit) + 1;
                        }

                        if (u.results.length < this.limit) {
                            this.totalPages = 1;
                        } else {
                            this.totalPages = Math.ceil(u.count / this.limit);
                        }

                        this.value.splice(0, this.length);

                        for (let i = 0; i < u.results.length; i++) {
                            const model = new DRFModel(this.apiUrl, this.http);
                            model.init(u.results[i]);
                            this.value.splice(i, 0, model.model);
                        }

                    }
                    return this.value;
                }),
            );
    }

}
