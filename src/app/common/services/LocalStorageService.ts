import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
    private prefix = 'lightyear';
    constructor() { }

    set(key: string, value?: any) {
        const val = this.toJson(value);
        localStorage.setItem(this.createKey(key), val);
    }

    get(key: string) {
        const item = localStorage.getItem(this.createKey(key));
        return this.fromJson(item);
    }

    private createKey(key: string) {
        return `${this.prefix}.${key}`;
    }

    private fromJson(json: string) {
        if (!json || json === 'null') {
            return null;
        }

        return JSON.parse(json);
    }

    private toJson(obj: any) {
        if (typeof obj === 'undefined') {
            return null;
        }
        return JSON.stringify(obj);
    }
}
