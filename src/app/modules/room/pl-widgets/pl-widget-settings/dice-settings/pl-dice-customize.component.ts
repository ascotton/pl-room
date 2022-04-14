import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { PLDiceParams } from '../../pl-widget.model';
import { PLDiceWidgetService } from '../../pl-dice-widget/pl-dice-widget.service';

@Component({
    selector: 'pl-dice-customize',
    templateUrl: 'pl-dice-customize.component.html',
    styleUrls: ['./pl-dice-customize.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLDiceCustomizeComponent implements OnChanges {
    @Input() params: PLDiceParams;
    @Output() readonly sidesChange: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();
    options = [];

    constructor(private  diceWidget: PLDiceWidgetService) {
    }

    ngOnChanges() {
        if (this.params) {
            this.options = this.diceWidget.options[this.params.type].map((option) => {
                return {
                    label: option,
                    selected: this.params.selectedSides.indexOf(option) !== -1,
                };
            });
        }
    }

    toggleSelection(option) {
        if (option.selected && this.selectedOptions.length <= 2) {
            return; // don't allow less than 2 sides selected
        }
        option.selected = !option.selected;
        this.sidesChange.emit(this.selectedOptions.map(op => op.label));
    }

    get selectedOptions() {
        return this.options.filter(option => option.selected);
    }
}
