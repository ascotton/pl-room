import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { PLMultiLanguageService } from '../../../pl-multi-lang.service';
import { CheckResult, CHECK_STATUS } from '../../pl-tech-check.model';
import { PLTechCheckService } from '../../pl-tech-check.service';

@Component({
    selector: 'pl-audio-playback-step',
    templateUrl: 'pl-audio-playback-step.component.html',
    styleUrls: ['./pl-audio-playback-step.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLAudioPlaybackStepComponent implements OnInit, OnDestroy {
    @ViewChild('audioPlayer', { static: false }) audioPlayer: ElementRef;
    @Input() public stepNumber: number;
    readonly audioFile = '/assets/audio/oxygen.mp3';
    currentLevel = 0;
    private initialized = false;
    private interval;
    private analyser;
    private subscriptions: Subscription[] = [];

    constructor(private zone: NgZone,
                private techCheckService: PLTechCheckService,
                private snackBar: MatSnackBar,
                private multiLangService: PLMultiLanguageService) {
        this.subscriptions.push(
            this.techCheckService.stepStarted$.subscribe((step) => {
                if (step === this.stepNumber) {
                    if (!this.initialized) {
                        const context = new AudioContext();
                        const track = context.createMediaElementSource(this.audioPlayer.nativeElement);
                        track.connect(context.destination);
                        this.analyser = context.createAnalyser();
                        track.connect(this.analyser);
                        this.initialized = true;
                    }
                    this.interval = setInterval(() => {
                        const frequencyData = new Uint8Array(1);
                        this.analyser.getByteFrequencyData(frequencyData);
                        const level = frequencyData[0];
                        this.zone.run(() => this.currentLevel = level);
                    },                          20);
                } else if (this.interval) {
                    window.clearInterval(this.interval);
                }
            }),
        );
    }

    isMultiLangEnabled = () => this.multiLangService.isMultiLangEnabled;

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    ngOnInit() {

    }

    isCheckCompleted() {
        return this.techCheckService.isStepCompleted(this.stepNumber);
    }

    onTestSpeaker() {
        this.audioPlayer.nativeElement.play();
    }

    onAnswerChanged(ev: MatRadioChange) {
        const result: CheckResult = { status: CHECK_STATUS.SUCCEED };
        if (!ev.value) {
            result.status = CHECK_STATUS.FAILED;
            result.error = 'User cannot hear playback.'; // Review this text
            this.snackBar.open(this.multiLangService.translateKey('STEPS.AUDIO.SPEAKERS_MUTED'), 'Close', {
                duration: 3000,
            });
        }
        this.setResult(result);
    }

    private setResult(result: CheckResult) {
        this.techCheckService.results.audioPlayback = result;
    }
}
