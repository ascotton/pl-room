import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { range } from 'lodash';

@Component({
    selector: 'pl-slider',
    templateUrl: './pl-slider.component.html',
    styleUrls: ['./pl-slider.component.less']
})
export class PLSliderComponent implements OnChanges {
    @Input() min = 10;
    @Input() max = 10;
    @Input() sliderValue = 0;
    @Input() minimalLabels = false;
    @Output() sliderValueChange: EventEmitter<number> = new EventEmitter<number>();
    values: number[];

    ngOnChanges(changes: SimpleChanges) {
        const minChange = changes['min'];
        const maxChange = changes['max'];
        if (minChange && maxChange && (minChange.currentValue !== minChange.previousValue || maxChange.currentValue !== maxChange.previousValue)) {
            this.values = range(this.min, this.max + 1);
        }
    }
}
