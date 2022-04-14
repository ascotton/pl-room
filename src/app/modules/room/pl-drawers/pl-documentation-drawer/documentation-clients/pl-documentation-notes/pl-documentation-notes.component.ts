export interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}
const {webkitSpeechRecognition, SpeechRecognition} : any =window;

import * as moment from 'moment';

import {
    Component, Input, ViewChild, ElementRef, ChangeDetectorRef, Output, EventEmitter,
} from '@angular/core';
import { first } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppStore } from '@app/appstore.model';

import { 
    PLRecordRoomService,
} from '@common/services-ng2/pl-records';

@Component({
    selector: 'pl-documentation-notes',
    templateUrl: './pl-documentation-notes.component.html',
    styleUrls: ['./pl-documentation-notes.component.less']
})
export class PLDocumentationNotesComponent {
    @Input() record: any = {};
    @Input() clientId: string = '';
    @Input() providerUserId: string = '';
    @Input() event: any = {};
    @Input() noteSchema: any = {};
    @Input() instanceId: string = '';
    @Input() haveNewMetrics: number = 0;
    @Input() clientServiceId: string = '';
    @Input() metrics: any[] = [];

    @Output() onNotesSaving = new EventEmitter<any>();
    @Output() onNotesEditing = new EventEmitter<any>();

    @ViewChild('notesSubjective', {static: false}) notesSubjective: ElementRef;
    @ViewChild('notesObjective', {static: false}) notesObjective: ElementRef;
    @ViewChild('notesAssessment', {static: false}) notesAssessment: ElementRef;
    @ViewChild('notesPlan', {static: false}) notesPlan: ElementRef;
    @ViewChild('notesNotes', {static: false}) notesNotes: ElementRef;

    view: string = '';
    classesView = {
        'subjective': '',
        'objective': '',
        'assessment': '',
        'plan': '',
        'notes': '',
    };
    notes: any = {
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
        notes: '',
    };
    savingMessage: string = '';
    timeoutSavingTrigger: any = null;

    speaking: boolean = false;
    speechRecognition: any = null;
    recognizing: boolean = false;
    finalTranscript: string = '';
    // Hardcoded feature flag / way to turn it off.
    speechToTextEnabled: boolean = true;
    speechTimeout: any = null;
    speechTimeoutSeconds: number = 15;

    metricPoints: any[] = [];

    hideDictationDisclaimer: boolean = false;
    // For dictation, want just one, not one per instance.
    localStorageKeyDictation: string = 'documentationNotesDictation';
    localStorageDataDictation: any = {};
    dictationDisclaimerResetDays: number = 30;
    momentFormat = 'YYYY-MM-DD HH:mm:ssZ';

    // One per client appointment, so will set later once have instance id.
    localStorageKey: string = '';
    localStorageData: any = {};

    constructor(
        private plRecordRoom: PLRecordRoomService,
        private cd: ChangeDetectorRef,
        private store: Store<AppStore>,
    ) {}

    ngOnInit() {
        this.initSpeakToText();
        // We only want to have ONE instance of notes listening for speech at a
        // time. So any time one is started, will we set and broadcast that current
        // instance id. All others will listen for this and if their instance if not
        // the current one, they will stop themselves.
        this.store.select('documentationNotes')
            .subscribe((documentationNotes: any) => {
                if (documentationNotes.speakingInstanceId !== this.instanceId) {
                   this.stopSpeaking();
                }
                if (documentationNotes.hideDictationDisclaimer !== undefined) {
                    this.hideDictationDisclaimer = documentationNotes.hideDictationDisclaimer;
                }
            });

        let data: any = localStorage.getItem(this.localStorageKeyDictation);
        if (data) {
            data = JSON.parse(data);
            if (data.hideDictationDisclaimer) {
                let useHide = true;
                if (data.hideDictationDisclaimerDate) {
                    const lastDate = moment(data.hideDictationDisclaimerDate, this.momentFormat);
                    const daysFromNow = moment().diff(lastDate, 'days');
                    if (daysFromNow >= this.dictationDisclaimerResetDays) {
                        useHide = false;
                        this.dictationDisclaimerSeen(false);
                    }
                }
                if (useHide) {
                    this.hideDictationDisclaimer = data.hideDictationDisclaimer;
                }
            }
        }
    }

    ngOnChanges(changes: any) {
        // Default
        let view = 'subjective';
        if (this.instanceId) {
            this.localStorageKey = `documentationNotes${this.instanceId}`;
            // Load state from local storage and pre-select if necessary.
            let data: any;
            try {
                data = localStorage.getItem(this.localStorageKey);
            } catch (e) {
                console.debug('localStorage error in PLDocumentationNotesComponent');
            }
            if (data) {
                data = JSON.parse(data);
                if (data.view) {
                    view = data.view;
                }
            }
        }
        this.view = view;
        this.toggleView(this.view);

        if (this.record.notes) {
            if (typeof(this.record.notes) === 'string') {
                this.notes = Object.assign(this.notes, JSON.parse(this.record.notes));
            } else {
                this.notes = Object.assign(this.notes, this.record.notes);
            }
        } else {
            this.notes = {
                subjective: '',
                objective: '',
                assessment: '',
                plan: '',
                notes: '',
            };
            this.record.notes = { ...this.notes };
        }

        if (this.haveNewMetrics) {
            this.getMetrics();
        }
    }

    getMetrics() {
        this.plRecordRoom.getMetrics(this.clientServiceId, this.record.uuid, this.metrics)
            .subscribe((res: any) => {
                this.metricPoints = res.metricPoints;
            });
    }

    formatMetrics(metrics) {
        let metricsList = [];
        metrics.forEach((metric) => {
            // Only add if the metric has at least one data point (1 trial).
            if (metric.trials > 0) {
                let percent;
                if (metric.percentage !== undefined) {
                    percent = metric.percentage;
                } else {
                    percent = (metric.trials <= 0) ? 0 :
                        (Math.round(metric.correct / metric.trials * 100));
                }
                metricsList.push(`${metric.metric.name}: ${metric.correct}/${metric.trials} (${percent}%)`);
            }
        });
        return metricsList.join('; ');
    }

    importMetrics() {
        const existingText = (this.notes.objective.length > 0) ? `${this.notes.objective}\n\n` : '';
        this.notes.objective = `${existingText}${this.formatMetrics(this.metricPoints)}`;
        this.haveNewMetrics = 0;
        this.saveNote('objective');
    }

    toggleView(view: string) {
        this.view = view;
        if (this.localStorageKey) {
            this.localStorageData.view = this.view;
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageData));
        }
        for (const key in this.classesView) {
            const note: string = this.notes[key];
            const hasTextClass: string = note && note.trim().length ? 'has-text ' : '';
            if (key === view) {
                this.classesView[key] = hasTextClass + 'selected';
            } else {
                this.classesView[key] = hasTextClass;
            }
        }
    }

    onEditingNotes() {
        this.onNotesEditing.emit(true);
    }

    saveNote(view: string) {
        if (this.notes[view] !== this.record.notes[view]) {
            if (this.timeoutSavingTrigger) {
                clearTimeout(this.timeoutSavingTrigger);
            }
            this.savingMessage = 'Saving..';
            const newNote = this.notes[view];
            this.record.notes[view] = newNote;
            this.onNotesSaving.emit(true);
            this.plRecordRoom.saveRecord(this.record, this.clientId, this.record.appointment,
                this.event, this.providerUserId)
                .pipe(first()).subscribe((resRecord: any) => {
                    this.savingMessage = 'Saved';
                    this.timeoutSavingTrigger = setTimeout(() => {
                        this.savingMessage = '';
                    }, 2000);
                    this.onNotesSaving.emit(false);
                    this.onNotesEditing.emit(false);
                }, (err) => {
                    this.savingMessage = 'Error';
                    this.onNotesSaving.emit(false);
                    this.onNotesEditing.emit(false);
                });
            this.toggleView(this.view);
        } else {
            this.onNotesEditing.emit(false);
        }
    }

    initSpeakToText() {
        let blockSpeech = (/edg/.test(navigator.userAgent) || /Edg/.test(navigator.userAgent)) ? 1 : 0;
        console.log('blockSpeech', blockSpeech, navigator.userAgent);
        if (this.speechToTextEnabled && 'webkitSpeechRecognition' in window && !blockSpeech) {
            this.speechRecognition = new webkitSpeechRecognition();
        // if ('SpeechRecognition' in window) {
        //     this.speechRecognition = new SpeechRecognition();
            this.speechRecognition.continuous = true;
            this.speechRecognition.interimResults = true;

            this.speechRecognition.onstart = () => {
                this.recognizing = true;
            };

            this.speechRecognition.onerror = (event) => {
                console.log(event.error);
            };

            this.speechRecognition.onend = () => {
                this.recognizing = false;
            };

            this.speechRecognition.onresult = (event) => {
                this.speakingResetTimeout();
                let interimTranscript = '';
                for (let ii = event.resultIndex; ii < event.results.length; ++ii) {
                    if (event.results[ii].isFinal) {
                        this.finalTranscript += event.results[ii][0].transcript;
                        let noteKey = (this.noteSchema.code === 'general') ? 'notes' : this.view;
                        this.notes[noteKey] = this.notes[noteKey] + '\n' + this.finalTranscript;
                        // We are outside Angular so need to detect changes to get the text to show up in the
                        // text area.
                        this.cd.detectChanges();
                        this.saveNote(noteKey);
                        this.finalTranscript = '';
                        // Scroll to bottom of textarea.
                        let keyMap = {
                            'subjective': this.notesSubjective,
                            'objective': this.notesObjective,
                            'assessment': this.notesAssessment,
                            'plan': this.notesPlan,
                            'notes': this.notesNotes,
                        };
                        let element = keyMap[noteKey].nativeElement.querySelector('textarea');
                        setTimeout(() => {
                            this.textareaMoveCursorToEnd(element);
                        }, 0);
                    } else {
                        interimTranscript += event.results[ii][0].transcript;
                    }
                }
            };
        }
    }

    textareaMoveCursorToEnd(el) {
        el.scrollTop = el.scrollHeight;
    }

    speakingResetTimeout() {
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
        }
        this.speechTimeout = setTimeout(() => {
            this.stopSpeaking();
        }, this.speechTimeoutSeconds * 1000);
    }

    startSpeaking() {
        if (this.speechRecognition) {
            this.finalTranscript = '';
            this.speechRecognition.lang = 'en-US';
            this.speechRecognition.start();
            this.speaking = true;
            this.store.dispatch({ type: 'UPDATE_DOCUMENTATION_NOTES', payload: { speakingInstanceId: this.instanceId } });
            this.speakingResetTimeout();
        }
    }

    stopSpeaking() {
        if (this.recognizing) {
            this.speechRecognition.stop();
        }
        this.speaking = false;
    }

    dictationDisclaimerSeen(hideIt=true) {
        this.hideDictationDisclaimer = hideIt;
        if (this.localStorageKeyDictation) {
            this.localStorageDataDictation.hideDictationDisclaimer = this.hideDictationDisclaimer;
            this.localStorageDataDictation.hideDictationDisclaimerDate = moment().format(this.momentFormat);
            localStorage.setItem(this.localStorageKeyDictation, JSON.stringify(this.localStorageDataDictation));
        }
        if (hideIt) {
            this.store.dispatch({ type: 'UPDATE_DOCUMENTATION_NOTES', payload: { hideDictationDisclaimer: this.hideDictationDisclaimer } });
        }
    }

    isEditable() {
        return this.record && !this.record.signed;
    }
}
