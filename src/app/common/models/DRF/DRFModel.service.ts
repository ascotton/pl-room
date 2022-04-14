import { Injectable } from '@angular/core';
import { PLHttpService } from '@root/src/lib-components';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class DRFModel {
    model: any = {};
    apiUrl = '';
    constructor(apiUrl: string, public http: PLHttpService) {
        this.apiUrl = apiUrl;
    }

    init(model) {
        if (model) {
            this.model = { ...model };
        } else {
            this.model = {};
        }
    }

    patch(fields) {
        const props = {};
        fields.forEach((item) => {
            props[item] = this.model[item];
        });
        const url = this.model.resource_uri;

        return this.http.save(
            '',
            props,
            url,
        ).subscribe((result: any) => {
            Object.keys(result).forEach((key) => {
                this.model[key] = result[key];
            });
            return this.model;
        });
    }

    isSaved() {
        return this.model.hasOwnProperty('resource_uri');
    }

    save(obj = {}, token = null) {
        let props: any = {};
        Object.keys(this.model).forEach((key: string) => {
            if (key.charAt(0) !== '$' && key.charAt(0) !== '_') {
                props[key] = this.model[key];
            }
        });

        props = Object.assign(props, obj);

        let httpRequest: Observable<any>;
        if (props.hasOwnProperty('resource_uri')) {
            const url = props.resource_uri;
            delete props.resource_uri;
            httpRequest = this.http.put('', props, url, { jwtToken: token, suppressError: true });
        } else {
            const url = this.apiUrl;
            httpRequest = this.http.save('', props, url, { jwtToken: token, suppressError: true });
        }

        return httpRequest
            .pipe(
                map(
                    (result) => {
                        Object.keys(result).forEach((key) => {
                            this.model[key] = result[key];
                        });
                        return this.model;
                    },
                ),
                catchError(
                    (_error) => {
                        return this.model;
                    },
                ),
            );
    }

    setKey(key) {
        const url = this.model.resource_uri ? this.model.resource_uri : this.apiUrl;
        this.model.resource_uri = `${url}${key}/`;
        return this.model;
    }

    get(token = null) {
        if (!this.model.hasOwnProperty('resource_uri')) {
            throw new Error('This model hasn\'t been saved yet.');
        }

        return this.http.get('', {}, this.model.resource_uri, { jwtToken: token, suppressError: true }).pipe(
            map(
                (result: any) => {
                    Object.keys(result).forEach((key) => {
                        this.model[key] = result[key];
                    });
                    return this.model;
                },
            ),
        );
    }

    delete() {
        if (!this.model.hasOwnProperty('resource_uri')) {
            throw new Error('This model hasn\'t been saved yet.');
        }

        return this.http.delete('', {}, this.model.resource_uri).subscribe(() => {
            return this.model;
        });
    }

}
