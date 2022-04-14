import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PLDiceWidgetService } from '../../pl-dice-widget/pl-dice-widget.service';
import { PLDiceParams } from '../../pl-widget.model';
@Component({
    selector: 'pl-dice-settings',
    templateUrl: 'pl-dice-settings.component.html',
    styleUrls: ['./pl-dice-settings.component.less'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PLDiceSettingsComponent implements OnInit {

    @Input() paramsModel: PLDiceParams;
    @Output() readonly paramsModelChange: EventEmitter<PLDiceParams> = new EventEmitter<PLDiceParams>();
    @Output() readonly customize: EventEmitter<void> = new EventEmitter<void>();
    diceTypes = [];

    constructor(private diceWidget: PLDiceWidgetService) {
        this.diceTypes = diceWidget.DICE_TYPES;
    }

    ngOnInit() {

    }
    ngOnChanges(changes) {
    }

    //  stop event propagation to keep the mat-menu from closing
    preventClose($event) {
        $event.stopPropagation();
        $event.preventDefault();
    }

    // as preventClose, but checkboxes need their model updated manually
    clickedCheckbox = ($event, paramName) => {
        $event.stopPropagation();
        $event.preventDefault();
        if (!this.isCheckboxDisabled(paramName)) {
            this.paramsModel[paramName] = !this.paramsModel[paramName];
            this.paramChanged(this.paramsModel[paramName], paramName);
        }
    }

    isCheckboxDisabled(paramName) {
        if (paramName === 'colored') {
            return this.paramsModel.type === 'colors';
        } else if (paramName === 'counter') {
            return this.paramsModel.type !== 'dots' && this.paramsModel.type !== 'numbers';
        }
        return false;
    }

    paramChanged(param: string, value: any) {
        const oldValue = this.paramsModel[param];
        this.paramsModel[param] = value;
        if (param === 'type') {
            this.paramsModel.numberOfSides = this.maxDiceSides;
            this.paramsModel.selectedSides = this.diceWidget.options[value].slice(0, this.paramsModel.numberOfSides);
            this.paramsModel.dice = this.paramsModel.dice.map((_el, i) => 1 + (i % this.paramsModel.numberOfSides));
            if (value === 'colors') {
                this.paramsModel.colored = true;
            }
            if (value === 'colors' || value === 'letters') {
                this.paramsModel.counter = false;
            }
        } else if (param === 'numberOfSides') {
            if (this.paramsModel.numberOfSides < oldValue) {
                this.paramsModel.selectedSides = this.paramsModel.selectedSides.slice(0, value);
            } else {
                // Fill missing sides
                const options = this.diceWidget.options[this.paramsModel.type];
                const availableSides = options.filter((o) => !this.paramsModel.selectedSides.some((s) => s === o));
                const missingSides = this.paramsModel.numberOfSides - oldValue;
                const sidesToAdd = availableSides.slice(0, missingSides);
                this.paramsModel.selectedSides = this.paramsModel.selectedSides.concat(sidesToAdd);
            }
            this.paramsModel.dice = this.paramsModel.dice.map((_el, i) => 1 + (i % this.paramsModel.numberOfSides));
        }
        this.paramsModelChange.emit(this.paramsModel);
    }

    get maxDiceSides() {
        const type = this.paramsModel['type'];
        if (type === 'numbers') {
            return 20;
        }
        if (type === 'letters') {
            return 26;
        }
        return 6;
    }

    onDiceSidesChanged(sides: string[]) {
        if (this.paramsModel.numberOfSides > sides.length) {
            this.paramsModel.dice = this.paramsModel.dice.map((_el, i) => 1 + (i % sides.length));
        }
        this.paramsModel.numberOfSides = sides.length;
        this.paramsModel.selectedSides = sides;
        this.paramsModelChange.emit(this.paramsModel);
    }

}
