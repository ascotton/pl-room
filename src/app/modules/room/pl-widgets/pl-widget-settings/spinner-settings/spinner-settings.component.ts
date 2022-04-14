import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'pl-spinner-settings',
    templateUrl: 'spinner-settings.component.html',
    styleUrls: ['./spinner-settings.component.less'],
})
export class PLSpinnerSettingsComponent {
    @Input() paramsModel: any;
    @Output() readonly paramsModelChange: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
    }

    ngOnChanges(changes) {
    }

    sectorsChanged(value) {
        this.paramsModel = { ...this.paramsModel };
        this.paramsModel['numberOfSectors'] = value;
        this.paramsModelChange.emit(this.paramsModel);
    }

    preventClose($event) {
        $event.stopPropagation();
        $event.preventDefault();
    }
}
