import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PLUrlsService } from '@root/index';
import { IntrojsService } from '@root/src/app/common/services-ng2';
import { LiveagentService } from '@root/src/app/common/services/LiveagentService';
import { AppState } from '@root/src/app/store';
import { environment } from '@root/src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectCurrentUser } from '../../../user/store';

@Component({
    selector: 'pl-help-drawer',
    templateUrl: 'pl-help-drawer.component.html',
    styleUrls: ['./pl-help-drawer.component.less'],
})
export class PLHelpDrawerComponent implements OnInit {
    version = '';
    isProvider$: Observable<boolean>;

    constructor(store: Store<AppState>,
                private plUrls: PLUrlsService,
                private liveagentService: LiveagentService,
                private introjsService: IntrojsService,) {
        this.isProvider$ = store.select(selectCurrentUser).pipe(
            map(user =>
                user && user.groups &&
                user.groups.indexOf('Provider') > -1 ||
                user.groups.indexOf('Service & Support') > -1 ||
                user.groups.indexOf('School Staff Providers') > -1 ||
                user.groups.indexOf('Private Practice') > -1),
        );
        this.version = environment.git_sha ? environment.git_sha.slice(0, 4) : '';
    }

    ngOnInit() {

    }

    onComputerSetup() {
        this.openLink(this.plUrls.urls.techcheckFE);
    }

    onSupportChat() {
        this.liveagentService.startChat();
    }

    onHelpCenter() {
        this.openLink(this.plUrls.urls.helpDocsFE);
    }

    onStartTour() {
        this.introjsService.roomOverview();
    }

    onTelehealthInstitute() {
        this.openLink(this.plUrls.urls.telehealthInstituteFE);
    }

    private openLink(url, newWindow = true) {
        if (newWindow) {
            window.open(url, '_blank');
        } else {
            window.location.href = url;
        }
    }
}
