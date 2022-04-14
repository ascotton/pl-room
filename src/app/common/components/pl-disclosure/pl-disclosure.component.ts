import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'pl-disclosure',
    templateUrl: './pl-disclosure.component.html',
    styleUrls: ['./pl-disclosure.component.less'],
})
export class PLDisclosureComponent {
    @Input() active = false;
    @Input() label = 'test';
    @Input() clickId = '';
    @Output() readonly click = new EventEmitter<any>();

    constructor() {
    }

    onClick() {
        this.click.emit({ id: this.clickId });
    }
}
