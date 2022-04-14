import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { PLUrlsService } from '@root/index';
import { selectCurrentUser } from '@root/src/app/modules/user/store';
import { AppState } from '@root/src/app/store';
import { Subscription } from 'rxjs';
import { AppModel } from '../../../common/models/app-model.service';
import { LiveagentService } from '../../../common/services/LiveagentService';
import { ProfileMenuActions, selectIsShown } from './store';

@Component({
    selector: 'pl-profile-menu',
    templateUrl: 'pl-profile-menu.component.html',
    styleUrls: ['./pl-profile-menu.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLProfileMenuComponent implements OnInit, OnDestroy {
    @ViewChild('profileMenu', { static: false }) profileMenuRef: ElementRef;
    isSchoolStaffOrPrivatePractice = false;
    show = false;
    username = '';
    private subscriptions: Subscription[] = [];
    constructor(private store: Store<AppState>,
                private plUrls: PLUrlsService,
                private appModel: AppModel,
                private liveAgentService: LiveagentService) {
        this.subscriptions.push(
            store.select(selectCurrentUser).subscribe((user) => {
                this.username = user.display_name;
                this.isSchoolStaffOrPrivatePractice = user
                    && user.groups
                    && (user.groups.some((g: any) => g.indexOf('School Staff') > -1)
                        || user.groups.indexOf('Private Practice') > -1);
            }),
            store.select(selectIsShown).subscribe((state) => {
                this.show = state;
            }),
        );
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    landingHomeUrl = () => this.plUrls.urls.eduClientsFE + '/landing-home';
    roomUrl = () => this.plUrls.urls.roomFE;
    libraryUrl = () => this.plUrls.urls.libraryFE;
    clientsUrl = () => this.plUrls.urls.clientsFE;
    scheduleUrl = () => this.plUrls.urls.scheduleFE;
    billingUrl = () => this.plUrls.urls.billingFE;
    homeUrl = () => this.isSchoolStaffOrPrivatePractice ? this.landingHomeUrl() : this.plUrls.urls.eduClientsFE;
    helpUrl = () => this.plUrls.urls.helpDocsFE;
    privacyPolicyUrl = () => this.plUrls.urls.privacyPolicyFE;
    setupUrl = () => this.plUrls.urls.techcheckFE;
    copyrightPolicyUrl = () => this.plUrls.urls.copyrightFE;
    codeOfConductUrl = () => this.plUrls.urls.codeOfConductFE;

    windowClick = (event) => {
        if (this.show) {
            if (!(event.target === this.profileMenuRef.nativeElement
                || this.profileMenuRef.nativeElement.contains(event.target)
                || event.target.className.indexOf('profile-menu-button') > -1)) {
                this.closeMenu();
            }
        }
    }

    exitFromRoom = () => {
        this.appModel.showExitFromRoom();
    }

    closeMenu = () => {
        this.store.dispatch(ProfileMenuActions.toggleDisplay());
    }

    startChat() {
        this.liveAgentService.startChat();
        this.closeMenu();
    }

    openUrl(url, newWindow) {
        if (newWindow) {
            window.open(url, '_blank');
        } else {
            window.location.href = url;
        }
        this.closeMenu();
    }

    get chatAvailable() {
        return this.liveAgentService && this.liveAgentService.state && this.liveAgentService.state.chatAvailable;
    }

}
