import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'pl-timer-settings',
    templateUrl: 'timer-settings.component.html',
    styleUrls: ['./timer-settings.component.less'],
})
export class PLTimerSettingsComponent {
    @Input() paramsModel: any;
    @Output() readonly paramsModelChange: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
    }

    // as preventClose, but checkboxes need their model updated manually
    clickedAudioEnabledCheckbox = ($event) => {
        $event.stopPropagation();
        $event.preventDefault();

        this.paramsModel = { ...this.paramsModel };
        this.paramsModel['audioEnabled'] = !this.paramsModel['audioEnabled'];
        this.paramsModelChange.emit(this.paramsModel);
    }
}
