import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PLUrlsService } from '@root/index';
import { LiveagentService } from '@root/src/app/common/services/LiveagentService';
import { environment } from '@root/src/environments/environment';

@Component({
    selector: 'pl-user-menu',
    templateUrl: 'pl-user-menu.component.html',
    styleUrls: ['./pl-user-menu.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLUserMenuComponent implements OnInit {

    gitSha = '';
    constructor(private plUrls: PLUrlsService,
                private liveagentService: LiveagentService) { 
        this.gitSha = environment.git_sha ? environment.git_sha.slice(0, 4) : '';
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

    onChangePassword() {
        this.openLink(this.plUrls.urls.changePasswordFE, false);
    }

    onCopyrightPolicy() {
        this.openLink(this.plUrls.urls.copyrightFE);
    }

    onCodeOfConduct() {
        this.openLink(this.plUrls.urls.codeOfConductFE);
    }

    onSignOut() {
        this.openLink(this.plUrls.urls.logout, false);
    }

    private openLink(url, newWindow = true) {
        if (newWindow) {
            window.open(url, '_blank');
        } else {
            window.location.href = url;
        }
    }
}
