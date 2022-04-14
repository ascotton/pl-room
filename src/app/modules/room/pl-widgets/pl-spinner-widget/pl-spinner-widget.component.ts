
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
import { Subscription } from 'rxjs';
import { SpinnerPieChartService } from './spinner/spinner-pie-chart.service';
import { PixelRatioService } from './spinner/pixel-ratio.service';
import { SpinnerRotatorGeneratorService } from './spinner/spinner-rotator-generator.service';
import { SpinnerArrowService } from './spinner/spinner-arrow.service';

@Component({
    selector: 'pl-spinner-widget',
    templateUrl: 'pl-spinner-widget.component.html',
    styleUrls: ['./pl-spinner-widget.component.less'],
    providers: [PixelRatioService, SpinnerArrowService, SpinnerPieChartService, SpinnerRotatorGeneratorService],
})

export class PLSpinnerWidgetComponent implements OnInit {
    @Input() params: any;
    @Input() dragging = false;
    @Output() changed: EventEmitter<void> = new EventEmitter();

    private loopQueue = [];
    private exitLoop = false;
    private subscriptions: Array<Subscription> = [];
    numberOfSectors = 10;
    primary = false;
    rotationStartTime = 0;
    runHiddenSpinner = false;
    currentRotator = null;
    pieChartCanvas: HTMLCanvasElement;
    gradientCanvas: HTMLCanvasElement;
    arrowCanvas: HTMLCanvasElement;

    constructor(private currentUserModel: CurrentUserModel,
                private element: ElementRef,
                private pixelRatioWatcher: PixelRatioService,
                private arrow: SpinnerArrowService,
                private pieChart: SpinnerPieChartService,
                private rotatorGenerator: SpinnerRotatorGeneratorService) {
    }

    ngOnInit() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.rotationStartTime > 0) {
                const timeInBackground = Date.now() - this.rotationStartTime;
                if (timeInBackground < this.currentRotator.duration) {
                    this.rotateHelper(this.params.start, this.params.end, false);
                    this.currentRotator.increaseOverallTime(timeInBackground);
                    this.runHiddenSpinner = true;
                }
                this.rotationStartTime = 0;
            }
        },                        false);
        this.findCanvas();
    }

    ngOnChanges(changes: SimpleChanges) {
        const paramsChange = changes['params'];
        if (paramsChange && paramsChange.currentValue && paramsChange.previousValue !== paramsChange.currentValue) {
            this.fbCallback(paramsChange.currentValue, paramsChange.previousValue ? paramsChange.previousValue : {});
        }
    }

    updateSectors = () => {
        if (!this.rotatorGenerator) {
            return;
        }
        this.rotatorGenerator.setNumberOfSectors(this.numberOfSectors);
        this.pieChart.setNumberOfSectors(this.numberOfSectors);

        if (this.currentRotator) {
            this.currentRotator.recalcRotationEnd(this.numberOfSectors);
        }
        if (this.arrow) {
            this.arrow.draw();
        }
    }

    rotateHelper(start, end, isFinshed) {
        this.currentRotator = this.rotatorGenerator.getRotator({ start: start || 0, end: end || 0 });
        if (isFinshed) {
            this.currentRotator.isFinished = true;
        } else {
            this.arrow.setRotator(this.currentRotator);
        }
    }

    fbCallback = (params, _params) => {
        if (!params || !_params || this.runHiddenSpinner) {
            return;
        }
        if (params.numberOfSectors !== _params.numberOfSectors) {
            this.numberOfSectors = params.numberOfSectors || 0;
            if (!this.currentRotator || this.currentRotator.isFinished) {
                this.updateSectors();
            }
            if (this.isClinitian()) {
                this.changed.emit();
            }
        }
        if (!this.rotatorGenerator || !this.arrow) {
            return;
        }
        if (!this.primary && params.isRotating) {
            if (document.hidden) {
                this.rotationStartTime = Date.now();
                this.rotateHelper(params.start, params.end, false);
            } else {
                if (!this.currentRotator || this.currentRotator.isFinished) {
                    this.rotateHelper(params.start, params.end, false);
                }
            }
        }
        const endChanged = params.end !== _params.end;
        if (!this.isClinitian() && endChanged && (!params.isRotating || params.isRotating === _params.isRotating)) {
            this.rotateHelper(params.start, params.end, true);
        }
    }

    startRotation = function () {
        if (this.currentRotator && !this.currentRotator.isFinished) {
            return;
        }
        this.primary = true;
        this.currentRotator = this.rotatorGenerator.getRotator();
        this.params.start = this.currentRotator.originalStart;
        this.params.end = this.currentRotator.originalEnd;
        this.params.isRotating = true;
        this.changed.emit();
        this.arrow.setRotator(this.currentRotator);
    };

    checkCanvasReadiness = () => {
        const defered = new Promise((resolve, reject) => {
            requestAnimationFrame(() => {
                    resolve(null);
            });
        });

        return defered;
    }

    removeItemFromArray(array, item) {
        const index = array.indexOf(item);
        if (index === -1) {
            return array;
        }
        array.splice(index, 1);
        return this.removeItemFromArray(array, item);
    }

    draw = () => {
        if (this.loopQueue.length) {
            this.loopQueue.forEach((el) => {
                if (el && el.draw) {
                    el.draw();
                }
            });
        }
        if (this.loopQueue.length && !this.exitLoop) {
            requestAnimationFrame(this.draw);
        }
    }

    canvasReady = () => {
        this.numberOfSectors = (this.params.numberOfSectors || 0) || this.numberOfSectors;

        this.rotatorGenerator.init(this.numberOfSectors);

        this.pieChart.init(
            this.pieChartCanvas,
            this.numberOfSectors,
            this.gradientCanvas,
        );
        this.arrow.setCanvas(this.arrowCanvas);
        this.subscriptions.push(
            this.arrow.beginRotation$.subscribe(() => {
                this.loopQueue.push(this.arrow);
                this.draw();
            }),
        );
        this.subscriptions.push(
            this.arrow.finishRotation$.subscribe(() => {
                this.updateSectors();
                this.loopQueue = this.removeItemFromArray(this.loopQueue, this.arrow);
                this.params.isRotating = false;
                if (this.primary) {
                    this.changed.emit();
                }
                this.primary = false;
                this.runHiddenSpinner = false;
            }),
        );
        this.subscriptions.push(
            this.pieChart.draw$.subscribe(() => {
                this.loopQueue.push(this.pieChart);
                this.draw();
            }),
        );
        this.subscriptions.push(
            this.pieChart.drawn$.subscribe(() => {
                this.loopQueue = this.removeItemFromArray(this.loopQueue, this.pieChart);
            }),
        );
        this.pieChart.draw();

        if (this.params && this.params.end !== undefined) {
            this.rotateHelper(this.params.start, this.params.end, true);
        }
        this.arrow.draw();
    }

    onDelete() {
        this.subscriptions.forEach((s) => {
            s.unsubscribe();
        });
        this.exitLoop = true;
    }

    ngOnDestroy() {
        this.onDelete();
    }

    reinit() {
        this.pieChart.refreshPixelRatio();
        this.arrow.refreshPixelRatio();
        this.arrow.draw();
        this.pieChart.draw();
    }

    init() {
        this.checkCanvasReadiness().then(this.canvasReady);
    }

    isClinitian() {
        return this.currentUserModel.user.isClinicianOrExternalProvider();
    }

    findCanvas = () => {
        this.pieChartCanvas = this.element.nativeElement.querySelector('[class="pie-chart-canvas"]');
        this.gradientCanvas = this.element.nativeElement.querySelector('[class="gradient-canvas"]');
        this.arrowCanvas = this.element.nativeElement.querySelector('[class="arrow-canvas"]');

        if (!this.arrowCanvas || !this.pieChartCanvas || !this.gradientCanvas) {
            setTimeout(this.findCanvas);
        } else {
            this.pixelRatioWatcher
                .push(this.pieChartCanvas)
                .push(this.gradientCanvas)
                .push(this.arrowCanvas)
                .addCallback(() => {
                    this.reinit();
                });

                this.init();
            this.pixelRatioWatcher.map(true);
        }
    }

}
