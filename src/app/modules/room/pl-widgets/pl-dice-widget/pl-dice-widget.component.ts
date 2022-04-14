import { Component, Input, Output, OnChanges, EventEmitter, SimpleChanges, OnInit, NgZone } from '@angular/core';
import { PLDiceParams } from '../pl-widget.model';
import { PLDiceWidgetService } from './pl-dice-widget.service';
@Component({
    selector: 'pl-dice-widget',
    templateUrl: './pl-dice-widget.component.html',
    styleUrls: ['./pl-dice-widget.component.less'],
})
export class PLDiceWidgetComponent implements OnInit, OnChanges {
    @Input() params: PLDiceParams;
    @Input() dragging;
    @Output() readonly changed: EventEmitter<void> = new EventEmitter();
    readonly lettersArray = [];
    readonly colors = [];
    myId = Math.floor(Math.random() * 100000);
    animationReady = true;
    pendingLocalAnimationParameters: any = { };
    pendingRemoteAnimationParameters = null;
    localParams: PLDiceParams;
    counterValue = 0;
    diceCounterVisible = false;
    animating = false;
    dices = 1;
    dies = [];
    colored = false;
    type = 'dots';
    numberOfSides = 6;
    selectedSides = [];
    randomizer;
    randomValues;

    constructor(diceWidget: PLDiceWidgetService, private zone: NgZone) {
        this.lettersArray = diceWidget.options.letters;
        this.colors = diceWidget.options.colors;
    }

    ngOnInit() {
        this.import(this.params);
        this.refresh(this.params);
    }
    ngOnChanges(changes: SimpleChanges) {
        const paramsChange = changes['params'];
        if (paramsChange && paramsChange.currentValue && paramsChange.previousValue !== paramsChange.currentValue) {
            this.import(this.params);
            this.refresh(this.params);
            this.pendingLocalAnimationParameters.dirty = true;
            this.pendingLocalAnimationParameters['dices'] = this.params['dices'];
            this.pendingLocalAnimationParameters['colored'] = this.params['colored'];
            this.pendingLocalAnimationParameters['counter'] = this.params['counter'];
            this.pendingLocalAnimationParameters['type'] = this.params['type'];

            if (this.animationReady) {
                this.processPendingAnimationParameters();
            }

        }
    }

    handleDiceClick() {
        if (this.animationReady) {
            const dice = this.params.dice.map(() => 1 + Math.floor(Math.random() * this.params.numberOfSides));

            this.pendingLocalAnimationParameters.dirty = true;
            this.pendingLocalAnimationParameters.animating = false;

            this.import({ dice, animating: true });
            this.export(this.getParams({ callerId: this.myId }));
        }
    }

    getParams(overrides = null) {
        return Object.assign(this.localParams || {}, overrides || {});
    }

    export (params) {
        Object.assign(this.params, this.getParams(params));

        this.changed.emit();
    }

    processPendingAnimationParameters () {
        if (this.pendingRemoteAnimationParameters || this.pendingLocalAnimationParameters.dirty) {
            this.import(Object.assign(
                this.pendingRemoteAnimationParameters || {},
                this.pendingLocalAnimationParameters || {},
            ));

            this.pendingRemoteAnimationParameters = null;

            // Check if there were any local changes to state
            if (this.pendingLocalAnimationParameters.dirty) {
                this.pendingLocalAnimationParameters = {};

                this.export(null);
                this.changed.emit();
            }

        }
    }

    import(params, animationDuration = 3000) {
        if (this.animationReady) {
            this.localParams = this.getParams(params);
            const showCounter = this.localParams.type === 'dots' || this.localParams.type === 'numbers';

            if (params.animating) {
                this.animationReady = false;
                this.randomizer = setInterval(() => {
                    this.zone.run(() => {
                        const numberOfSides = this.localParams.numberOfSides;
                        const dice = this.localParams.dice;
                        this.randomValues = dice.map(() => 1 + Math.floor(Math.random() * numberOfSides));
                    });
                },                            150);
                setTimeout(() => {
                    this.localParams.animating = false;
                    this.counterValue = showCounter ?
                                        this.sum(this.localParams.dice.slice(0, this.localParams.dices)
                                            .map(dice => parseInt(this.localParams.selectedSides[dice - 1], 10)))
                                        : 0;
                    if (this.randomizer) {
                        window.clearInterval(this.randomizer);
                        this.randomValues = null;
                    }
                    setTimeout(() => {
                        this.animationReady = true;
                        this.processPendingAnimationParameters();
                    },         100);
                },         animationDuration);

            }
            if (this.localParams.dice) {
                this.counterValue = showCounter ?
                                    this.sum(this.localParams.dice.slice(0, this.localParams.dices)
                                        .map(dice => parseInt(this.localParams.selectedSides[dice - 1], 10)))
                                    : 0;
            }
        } else if (this.myId !== params.callerId) {
            this.pendingRemoteAnimationParameters = params;
        }
    }

    refresh(params) {
        this.dices = params.dices;
        this.diceCounterVisible = !params.animating && params.counter && params.type !== 'colors' && params.type !== 'letters';
        this.animating = params.animating;
        this.colored = params.colored;
        this.dies = params.dice;
        this.type = params.type;
        this.numberOfSides = params.numberOfSides;
        this.selectedSides = params.selectedSides;
    }

    private sum(dice) {
        return dice.reduce((a: number, b: number) => a + b, 0);
    }
}
