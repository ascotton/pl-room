import { Component, OnInit } from '@angular/core';

const PROXY_KEY = 'firebase_force_proxy';

@Component({
    selector: 'pl-student-settings',
    templateUrl: 'pl-student-settings.component.html',
    styleUrls: ['pl-student-settings.component.less'],
})

export class PLStudentSettingsComponent implements OnInit {
    public isProxyActive: boolean;

    constructor() {
        this.isProxyActive = Boolean(localStorage.getItem(PROXY_KEY));
    }

    ngOnInit() { }

    toggleProxy() {
        if (this.isProxyActive) {
            localStorage.removeItem(PROXY_KEY);
        } else {
            localStorage.setItem(PROXY_KEY, 'true');
        }
        window.location.reload();
    }
}
