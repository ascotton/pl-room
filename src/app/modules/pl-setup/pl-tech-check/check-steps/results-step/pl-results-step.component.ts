import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LiveagentService } from '@root/src/app/common/services/LiveagentService';
import { PLUrlsService } from '@root/src/lib-components';
import { groupBy } from 'lodash';
import { Subscription } from 'rxjs';
import { PLMultiLanguageService } from '../../../pl-multi-lang.service';
import { CheckResult, CHECK_STATUS, DEVICE_EXCEPTIONS, Steps, URLCheck } from '../../pl-tech-check.model';
import { PLTechCheckService } from '../../pl-tech-check.service';
import { PLEmailResultsComponent } from './pl-email-results.component';
import { PLRestartTechcheckDialogComponent } from './pl-restart-techcheck-dialog.component';

export enum StepResult {
    FAILED,
    WARNINGS,
    PASSED,
}
@Component({
    selector: 'pl-results-step',
    templateUrl: 'pl-results-step.component.html',
    styleUrls: ['./pl-results-step.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLResultsStepComponent implements OnInit, OnDestroy {
    @Input() public stepNumber: number;
    stepResult = StepResult;
    steps = Steps;
    detailsExpanded = false;
    copyingLink = false;
    deviceExceptions = DEVICE_EXCEPTIONS;
    criticalUrls: URLCheck[] = [];
    keyedCriticalUrls: any;
    optionalUrls: URLCheck[] = [];
    keyedOptionalUrls: any;
    resultsReady = false;
    isCriticalFail = false;
    hasWarnings = false;
    stepResults = {
        Permissions: StepResult.PASSED,
        AudioPlayback: StepResult.PASSED,
        Camera: StepResult.PASSED,
        Microphone: StepResult.PASSED,
        InternetSpeed: StepResult.PASSED,
    };
    private subscriptions: Subscription[] = [];

    constructor(private techCheckService: PLTechCheckService,
                private dialog: MatDialog,
                private liveagentService: LiveagentService,
                private plUrls: PLUrlsService,
                private multiLangService: PLMultiLanguageService) {
        this.subscriptions.push(
            this.techCheckService.stepStarted$.subscribe((step) => {
                if (step === this.stepNumber) {
                    this.buildStepResults();
                    this.isCriticalFail = this.getIsCriticalFail();
                    this.hasWarnings = this.getHasWarnings();
                    if (!this.techCheckService.isPreSavedResult) {
                        let status = 'PASSED';
                        if (this.isCriticalFail)  {
                            status = 'FAILED';
                        } else if (this.hasWarnings) {
                            status = 'WARNING';
                        }
                        this.subscriptions.push(
                            this.techCheckService.saveTechCheck(status).subscribe((data) => {
                                if (data) {
                                    this.techCheckService.setResultId(data.uuid);
                                    this.techCheckService.createdDate = new Date(data.created);
                                    this.techCheckService.isPreSavedResult = true;
                                }
                            }),
                        );
                    }
                    const urlChecks = this.techCheckService.results.permissions.urlCheck;
                    this.criticalUrls = urlChecks.filter(u => u.isCritical);
                    this.optionalUrls = urlChecks.filter(u => !u.isCritical);
                    this.keyedCriticalUrls = groupBy(this.criticalUrls, 'group');
                    this.keyedOptionalUrls = groupBy(this.optionalUrls, 'group');
                    this.resultsReady = true;
                }
            }),
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    ngOnInit() {

    }

    isMultiLangEnabled = () => this.multiLangService.isMultiLangEnabled;

    isCheckPassed(check: CheckResult) {
        return check.status === CHECK_STATUS.SUCCEED;
    }

    getFailedUrlChecks(checks: URLCheck[]) {
        return checks.filter(c => !this.isCheckPassed(c.status));
    }

    toggleDetails() {
        this.detailsExpanded = !this.detailsExpanded;
    }

    onCopyLink() {
        this.copyingLink = true;
        setTimeout(() => this.copyingLink = false, 3000);
    }

    onOpenChat() {
        this.liveagentService.startChat();
    }

    translate = key => this.multiLangService.translateKey(key);

    getFriendlyError(result: CheckResult) {
        let error = result.error;
        switch (result.error) {
                case this.deviceExceptions.NOT_FOUND:
                    error = this.translate('STEPS.RESULTS.NO_DEVICE');
                    break;
                case this.deviceExceptions.IN_USE:
                case this.deviceExceptions.ABORT_ERROR:
                    error = this.translate('STEPS.RESULTS.IN_USE');
                    break;
                case this.deviceExceptions.NO_PERMISSIONS:
                    error = this.translate('STEPS.RESULTS.NO_PERMISSIONS');
                    break;
                case this.deviceExceptions.OPENTOK_ERROR:
                    error = this.translate('STEPS.RESULTS.OPENTOK_ERROR');
                    break;
                case this.deviceExceptions.NO_VIDEO:
                    error = this.translate('STEPS.RESULTS.NO_VIDEO');
                    break;
                case this.deviceExceptions.NO_AUDIO:
                    error = this.translate('STEPS.RESULTS.NO_AUDIO');
                    break;
                case this.deviceExceptions.NO_SYSTEM_PERMISSIONS:
                    error = this.translate('STEPS.RESULTS.SYSTEM_DENIED');
                    break;
        }
        return error;
    }

    isTechCheckUDPBlocked() {
        return !this.techCheckService.isVideoUrlBlocked()
            && this.isCheckPassed(this.resultDetail.permissions.microphone)
            && this.isCheckPassed(this.resultDetail.permissions.camera);
    }

    onEmailResults() {
        this.dialog.open(PLEmailResultsComponent, {
            panelClass: 'pl-email-results',
            width: '50%',
            maxHeight: '99vh',
            maxWidth: 600,
            disableClose: true,
        });
    }

    onRestart() {
        this.dialog.open(PLRestartTechcheckDialogComponent, {
            panelClass: 'dark-blue-theme',
            width: '270px',
        });
    }

    get publicUrl() {
        return `${this.plUrls.urls.techcheckFE}?resultid=${this.techCheckService.resultId}`;
    }

    get resultDetail() {
        return this.techCheckService.results;
    }

    get networkLimits() {
        return this.techCheckService.NETWORK_TEST_LIMITS;
    }

    get isChatAvailable() {
        return this.liveagentService.state.chatAvailable;
    }
    get resultsDate() {
        return this.techCheckService.createdDate;
    }

    private getIsCriticalFail() {
        return this.getStepResult(this.steps.Permissions) === this.stepResult.FAILED
            || this.getStepResult(this.steps.Microphone) === this.stepResult.FAILED
            || this.getStepResult(this.steps.Camera) === this.stepResult.FAILED
            || this.getStepResult(this.steps.AudioPlayback) === this.stepResult.FAILED
            || this.getStepResult(this.steps.InternetSpeed) === this.stepResult.FAILED;
    }

    private getHasWarnings() {
        return this.getStepResult(this.steps.Permissions) === this.stepResult.WARNINGS
            || this.getStepResult(this.steps.Microphone) === this.stepResult.WARNINGS
            || this.getStepResult(this.steps.Camera) === this.stepResult.WARNINGS
            || this.getStepResult(this.steps.AudioPlayback) === this.stepResult.WARNINGS
            || this.getStepResult(this.steps.InternetSpeed) === this.stepResult.WARNINGS;
    }

    private getStepResult(step: Steps) {
        switch (step) {
                case Steps.Permissions:
                    const urlChecks = this.resultDetail.permissions.urlCheck;
                    if (urlChecks.some(u => u.isCritical && !this.isCheckPassed(u.status))) {
                        return this.stepResult.FAILED;
                    }
                    if (this.resultDetail.permissions.camera.error === this.deviceExceptions.NO_SYSTEM_PERMISSIONS
                    || this.resultDetail.permissions.microphone.error === this.deviceExceptions.NO_SYSTEM_PERMISSIONS) {
                        return this.stepResult.FAILED;
                    }
                    if (urlChecks.some(u => !u.isCritical && !this.isCheckPassed(u.status))) {
                        return this.stepResult.WARNINGS;
                    }
                    if (this.resultDetail.permissions.camera.error === this.deviceExceptions.NO_PERMISSIONS
                        || this.resultDetail.permissions.microphone.error === this.deviceExceptions.NO_PERMISSIONS) {
                        return this.stepResult.WARNINGS;
                    }
                    // FAIL If none of the above test failed and opentok connectivity test failed
                    const opentokResult = this.resultDetail.permissions.networkDetail.opentok.result;
                    if (!this.isCheckPassed(opentokResult)) {
                        return this.stepResult.FAILED;
                    }
                    return this.stepResult.PASSED;
                case Steps.AudioPlayback:
                    if (!this.isCheckPassed(this.resultDetail.audioPlayback)) {
                        return this.stepResult.WARNINGS;
                    }
                    return this.stepResult.PASSED;
                case Steps.Camera:
                    if (this.resultDetail.camera.error === this.deviceExceptions.NOT_FOUND) {
                        return this.stepResult.FAILED;
                    }
                    if (this.resultDetail.camera.error === this.deviceExceptions.NO_VIDEO
                        && !this.techCheckService.isVideoUrlBlocked()) {
                        return this.stepResult.FAILED;
                    }
                    if (this.resultDetail.camera.error === this.deviceExceptions.IN_USE
                        || this.resultDetail.camera.error === this.deviceExceptions.ABORT_ERROR) {
                        return this.stepResult.WARNINGS;
                    }
                    return this.stepResult.PASSED;
                case Steps.Microphone:
                    if (this.resultDetail.microphone.error === this.deviceExceptions.NO_AUDIO
                        || this.resultDetail.microphone.error === this.deviceExceptions.NOT_FOUND) {
                        return this.stepResult.FAILED;
                    }
                    return this.stepResult.PASSED;
                case Steps.InternetSpeed:
                    if (this.resultDetail.internetSpeed.internetSpeed.downloadSpeed < this.networkLimits.MIN_SPEED
                        || this.resultDetail.internetSpeed.internetSpeed.uploadSpeed < this.networkLimits.MIN_SPEED
                        || (this.getStepResult(Steps.Camera) === StepResult.PASSED
                            && this.resultDetail.internetSpeed.video.detail
                            && this.resultDetail.internetSpeed.video.detail.mos < this.networkLimits.MIN_MOS)
                        || (this.getStepResult(Steps.Microphone) === StepResult.PASSED
                            && this.resultDetail.internetSpeed.audio.detail
                            && this.resultDetail.internetSpeed.audio.detail.mos < this.networkLimits.MIN_MOS)) {
                        return this.stepResult.FAILED;
                    }
                    return this.stepResult.PASSED;
        }
        return this.stepResult.PASSED;
    }

    private buildStepResults() {
        this.stepResults.Permissions = this.getStepResult(Steps.Permissions);
        this.stepResults.AudioPlayback = this.getStepResult(Steps.AudioPlayback);
        this.stepResults.Camera = this.getStepResult(Steps.Camera);
        this.stepResults.Microphone = this.getStepResult(Steps.Microphone);
        this.stepResults.InternetSpeed = this.getStepResult(Steps.InternetSpeed);
    }

}
