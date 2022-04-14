import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PLTechCheckComponent } from './pl-tech-check.component';
import { PLBrowserCheckComponent } from './browser-check/pl-browser-check.component';
import { PLTechCheckStepsComponent } from './check-steps/pl-tech-check-steps.component';
import { RouterModule } from '@angular/router';
import { PLAppNavModule, PLDotLoaderModule, PLIconModule, PLMayService } from '@root/src/lib-components';
import { NgxGaugeModule } from 'ngx-gauge';
import { ClipboardModule } from '@angular/cdk/clipboard';

// Material Modules
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { PLTechCheckService } from './pl-tech-check.service';
import { PLPermissionIndicatorComponent } from './check-steps/permissions-step/pl-permission-indicator.component';
import { PLInternetSpeedStepComponent } from './check-steps/internet-speed-step/pl-internet-speed-step.component';
import { PLLangSelectCardComponent } from './check-steps/common-cards/pl-lang-select-card.component';
import { PLPermissionsStepComponent } from './check-steps/permissions-step/pl-permissions-step.component';
import { PLMultiLanguageService } from '../pl-multi-lang.service';
import { PLCameraCheckStepComponent } from './check-steps/camera-check-step/pl-camera-check-step.component';
import { PLAudioPlaybackStepComponent } from './check-steps/audio-playback-step/pl-audio-playback-step.component';
import { PLAudioLevelIndicatorComponent } from './check-steps/audio-level-indicator/pl-audio-level-indicator.component';
import { PLTechSupportCardComponent } from './check-steps/common-cards/pl-tech-support-card.component';
import { PLMicTestStepComponent } from './check-steps/microphone-step/pl-mic-test-step.component';
import { PLResultsStepComponent } from './check-steps/results-step/pl-results-step.component';
import { PLCheckResultComponent } from './check-steps/results-step/pl-check-result.component';
import { GuidService } from '@root/src/app/common/services/GuidService';
import { PLEmailResultsComponent } from './check-steps/results-step/pl-email-results.component';
import { PLRestartTechcheckDialogComponent } from './check-steps/results-step/pl-restart-techcheck-dialog.component';
import { environment } from '@root/src/environments/environment';

export function createTranslateLoader(http: HttpClient) {
    const gitSha = environment.git_sha ? environment.git_sha.slice(0, 4) : '';
    return new TranslateHttpLoader(http, './assets/i18n/pl-setup/', `.json?v=${gitSha}`);
}
@NgModule({
    imports: [
        BrowserModule,
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient],
            },
            isolate: true,
        }),
        MatGridListModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatStepperModule,
        MatSelectModule,
        PLIconModule,
        RouterModule.forRoot([], { enableTracing: true }),
        PLAppNavModule,
        PLDotLoaderModule,
        NgxGaugeModule,
        FormsModule,
        MatRadioModule,
        HttpClientJsonpModule,
        MatDialogModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatSnackBarModule,
        ClipboardModule,
    ],
    exports: [
        MatGridListModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatStepperModule,
        TranslateModule,
        MatTooltipModule,
    ],
    declarations: [
        PLTechCheckComponent,
        PLBrowserCheckComponent,
        PLTechCheckStepsComponent,
        PLPermissionsStepComponent,
        PLPermissionIndicatorComponent,
        PLInternetSpeedStepComponent,
        PLLangSelectCardComponent,
        PLCameraCheckStepComponent,
        PLAudioPlaybackStepComponent,
        PLAudioLevelIndicatorComponent,
        PLTechSupportCardComponent,
        PLMicTestStepComponent,
        PLResultsStepComponent,
        PLCheckResultComponent,
        PLEmailResultsComponent,
        PLRestartTechcheckDialogComponent,
    ],
    bootstrap:    [
        PLTechCheckComponent,
    ],
    providers: [
        PLTechCheckService,
        PLMultiLanguageService,
        GuidService,
        PLMayService,
    ],
})
export class PLTechCheckModule { }
