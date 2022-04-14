import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, Input, OnDestroy, OnInit,  ViewChild, ViewEncapsulation } from '@angular/core';
import { MatVerticalStepper } from '@angular/material/stepper';
import { PLMayService, PLUrlsService } from '@root/index';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
import { Subscription } from 'rxjs';
import { Steps } from '../pl-tech-check.model';
import { PLTechCheckService } from '../pl-tech-check.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '@root/src/environments/environment';
import { LiveagentService } from '@root/src/app/common/services/LiveagentService';
@Component({
    selector: 'pl-tech-check-steps',
    templateUrl: 'pl-tech-check-steps.component.html',
    styleUrls: ['./pl-tech-check-steps.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLTechCheckStepsComponent implements OnInit, OnDestroy {
    @Input() public initialStep = 0;
    @ViewChild('stepper', { static: false }) private stepper: MatVerticalStepper;
    userMenuLinks = [];
    currentUser;
    readonly steps: typeof Steps;
    private userGlobalPermissions;
    private subscriptions: Subscription[] = [];

    constructor(private currentUserModel: CurrentUserModel,
                private techCheckService: PLTechCheckService,
                private plUrls: PLUrlsService,
                private sanitizer: DomSanitizer,
                private plMay: PLMayService,
                private liveagentService: LiveagentService) {
        this.steps = this.techCheckService.steps;
        this.currentUser = currentUserModel.user;
        this.subscriptions.push(
            this.techCheckService.stepStarted$.subscribe((step) => {
                if (this.stepper) {
                    const stepId = this.stepper._getStepLabelId(step - 1);
                    const stepElement = document.getElementById(stepId);
                    if (stepElement) {
                        setTimeout(() => {
                            stepElement.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
                        },         250);
                    }
                }
            }),
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    ngOnInit() {
        this.formLinks();
        setTimeout(() => {
            this.techCheckService.setStep(this.initialStep);
        },         250);
    }

    isStepCompleted = step => this.techCheckService.isStepCompleted(step);

    stepChanged(ev: StepperSelectionEvent) {
        this.techCheckService.setStep(ev.selectedIndex);
    }

    get isStepsLocked() {
        return this.techCheckService.isPreSavedResult;
    }

    get isIserLoggedIn() {
        return (this.currentUserModel.user as any).isAuthenticated;
    }

    private formLinks() {
        this.userGlobalPermissions = (this.currentUser && this.currentUser.xGlobalPermissions) ?
        this.currentUser.xGlobalPermissions : {};
        this.formUserMenuLinks();
    }
    private formUserMenuLinks() {
        const sanitizedVoidUrl =  this.sanitizer.bypassSecurityTrustUrl('javascript:void(0);');
        const links: any = [];
        links.push({ hrefAbsolute: this.plUrls.urls.landing, label: 'Home', icon: 'home' });
        links.push({
            hrefAbsolute: sanitizedVoidUrl,
            label: 'Support Chat',
            icon: 'chat',
            click: this.onClickSupportChat,
        });

        if (this.userGlobalPermissions.provideServices || this.plMay.isAdminType(this.currentUser)) {
            links.push({
                hrefAbsolute: this.plUrls.urls.helpDocsFE,
                label: 'Help Center',
                icon: 'help',
                target: '_blank',
            });
        }
        if (this.isIserLoggedIn) {
            links.push({ hrefAbsolute: this.plUrls.urls.changePasswordFE, label: 'Change Password', icon: 'key' });
        }
        if (this.isIserLoggedIn) {
            links.push({ hrefAbsolute: this.plUrls.urls.logout, label: 'Sign Out', icon: 'signout' });
        }
        const gitSha = environment.git_sha ? environment.git_sha.slice(0, 4) : '';
        links.push({ hrefAbsolute: sanitizedVoidUrl, label: `Version: ${gitSha}`, icon: 'version', class: 'menu-item-no-link' });

        this.userMenuLinks = links;
    }

    private onClickSupportChat = () => this.liveagentService.startChat();
}
