import { Injectable } from '@angular/core';
import { environment } from '@root/src/environments/environment';

@Injectable()
export class PLGlobalUtilService {

    constructor() { }

    createCookie = (name: string, value: any, days: number) => {
        const _days = days || 1000;
        const date = new Date();
        date.setTime(date.getTime() + (_days * 24 * 60 * 60 * 1000));
        const expires = '; expires=' + date.toUTCString();
        document.cookie = `${name}=${value}${expires}; path=/; domain=${environment.cookie_domain}`;
    }

    readCookie = (name: string) => {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
            if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length, c.length); }
        }
        return null;
    }
}
