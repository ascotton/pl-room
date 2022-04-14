import { Platform } from '@angular/cdk/platform';
import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
import { PLMultiLanguageService } from '../pl-multi-lang.service';
import { Steps } from './pl-tech-check.model';
import { PLTechCheckService } from './pl-tech-check.service';
declare const unsupportedBrowserUrl; // Set on index.html file since it's also beign used before angular loading
@Component({
    selector: 'pl-tech-check',
    templateUrl: 'pl-tech-check.component.html',
    styleUrls: ['./pl-tech-check.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLTechCheckComponent implements OnInit {
    @Input() private lang: string;
    @Input() private resultid: string;
    @Input() public code: string;
    @Input() private salesforceid: string;
    initialStep = 0;
    initialized = false;

    constructor(private langService: PLMultiLanguageService,
                private techCheckService: PLTechCheckService,
                platform: Platform,
                changeDetector: ChangeDetectorRef,
                currentUserModel: CurrentUserModel,
                titleService: Title) {
        if (platform.ANDROID) {
            window.location.href = unsupportedBrowserUrl;
        }
        titleService.setTitle('Tech Check - Presence Learning');
        currentUserModel.getAuthenticatedUser(false, true);
        this.techCheckService.techCheckRestart$.subscribe(() => {
            this.initialStep = 0;
            this.initialized = false;
            changeDetector.detectChanges();
            this.initialized = true;
            changeDetector.detectChanges();
            this.techCheckService.setStep(this.initialStep);
        });
    }

    ngOnInit() {
        if (this.lang) {
            this.langService.setCurrentLang(this.lang);
        }
        if (this.salesforceid) {
            this.techCheckService.salesForceId = this.salesforceid;
        }
        if (this.resultid) {
            this.techCheckService.getTechCheckResult(this.resultid).subscribe((data) => {
                if (data) {
                    this.techCheckService.setSavedResult(data);
                    this.initialStep = Steps.Results;
                    this.techCheckService.isTechCheckStarted = true;
                }
                this.initialized = true;
            });
        } else {
            this.initialized = true;
        }
    }

    get techCheckStarted() {
        return this.techCheckService.isTechCheckStarted;
    }

}
