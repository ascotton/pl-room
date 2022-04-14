import { Component, Input,
    ElementRef,
    ViewChild,
    Output, EventEmitter,
} from '@angular/core';
import { first } from 'rxjs/operators';

import { PLLodashService } from '@root/index';
import { PLRecordRoomService } from '@common/services-ng2/pl-records';

@Component({
    selector: 'pl-documentation-metric-point',
    templateUrl: './pl-documentation-metric-point.component.html',
    styleUrls: ['./pl-documentation-metric-point.component.less']
})
export class PLDocumentationMetricPointComponent {
    @Input() metricPoint: any = {};
    @Input() record: any = {};
    @Input() clientId: string = '';
    @Input() providerUserId: string = '';
    @Input() event: any = {};

    @Output() onMetricPointUpdated = new EventEmitter<any>();

    @ViewChild('inputCorrect', {static: false}) inputCorrect: ElementRef;
    @ViewChild('inputTrials', {static: false}) inputTrials: ElementRef;

    showDescription: boolean = false;
    showGoal: boolean = false;
    show: any = {
        correct: {
            text: false,
            input: true,
        },
        trials: {
            text: false,
            input: true,
        },
    };
    showFullName: boolean = false;
    lastMetricPoint: any = {
        correct: 0,
        trials: 0,
    };
    classMetricName: string = 'short';
    updating: boolean = false;

    constructor(private plRecordRoom: PLRecordRoomService,
        private plLodash: PLLodashService) {
    }

    ngOnChanges() {
        if (this.metricPoint.correct === undefined) {
            this.metricPoint.correct = 0;
        }
        if (this.metricPoint.trials === undefined) {
            this.metricPoint.trials = 0;
        }
        this.lastMetricPoint.trials = this.metricPoint.trials;
        this.lastMetricPoint.correct = this.metricPoint.correct;
        this.calculatePercent();
    }

    toggleDescription() {
        this.showDescription = !this.showDescription;
        this.classMetricName = this.showDescription ? 'full' : 'short';
        if (this.showDescription) {
            this.showGoal = false;
        }
    }

    toggleGoalDescription() {
        this.showGoal = !this.showGoal;
        if (this.showGoal) {
            this.showDescription = false;
        }
    }

    incrementCorrect() {
        if (!this.updating && this.isEditable()) {
            this.metricPoint.correct++;
            this.metricPoint.trials++;
            this.calculateAndSave();
        }
    }

    incrementWrong() {
        if (!this.updating && this.isEditable()) {
            this.metricPoint.trials++;
            this.calculateAndSave();
        }
    }

    calculatePercent() {
        this.validateTrials();
        this.metricPoint.percent_correct = (this.metricPoint.trials <= 0) ? 0 :
         (Math.round(this.metricPoint.correct / this.metricPoint.trials * 100));
    }

    calculateAndSave() {
        if (!this.updating) {
            this.calculatePercent();
            this.updateMetric();
        }
    }

    updateMetric() {
        this.updating = true;
        const fields = ['id', 'record', 'correct', 'trials'];
        const metric: any = this.plLodash.pick(this.metricPoint, fields);
        metric.metricId = this.metricPoint.metric.id;
        this.plRecordRoom.saveMetricsPoint(metric, this.record, this.clientId, 
            this.record.appointment, this.event, this.providerUserId)
            .pipe(first()).subscribe((res: any) => {
                this.metricPoint.id = res.metricPoint.id;
                this.onMetricPointUpdated.emit({});
                this.updating = false;
            });
    }

    showInput(key) {
        this.show[key].input = true;
        this.show[key].text = false;
        this.focusInput(null, key);
    }

    focusInput(evt, key) {
        let ele = (key === 'correct') ? this.inputCorrect : this.inputTrials;
        setTimeout(() => {
            ele.nativeElement.querySelector('input').focus();
        }, 250);
    }

    blurInput(evt, key) {
        this.calculateAndSave();
    }

    keyInput(evt, key) {
        if (evt.keyCode === 13) {
            this.calculateAndSave();
        }
    }

    validateTrials() {
        if ((!this.metricPoint.correct && this.metricPoint.correct !== 0) || this.metricPoint.correct < 0) {
            this.metricPoint.correct = this.lastMetricPoint.correct;
        }
        if ((!this.metricPoint.trials && (this.metricPoint.trials !== 0 || this.metricPoint.correct !== 0))
         || this.metricPoint.trials < 0) {
            this.metricPoint.trials = this.lastMetricPoint.trials;
        }
        if (this.metricPoint.trials < this.metricPoint.correct) {
            this.metricPoint.trials = this.lastMetricPoint.trials;
            this.metricPoint.correct = this.lastMetricPoint.correct;
        }
        // Update for next time.
        this.lastMetricPoint.trials = this.metricPoint.trials;
        this.lastMetricPoint.correct = this.metricPoint.correct;
    }

    isEditable() {
        return this.record && !this.record.signed;
    }
}
