import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'pl-stream-action',
    templateUrl: 'stream-action.component.html',
    styleUrls: ['stream-action.component.less'],
})

export class StreamActionComponent implements OnInit {

    @Input() public toggled: boolean;
    @Input() public label: string;
    @Input() public icon: string;
    @Input() public svgIcon: string;
    @Input() public disabled: boolean;

    @Output() readonly action = new EventEmitter<void>();

    constructor() {
    }

    ngOnInit() { }

    onClick() {
        this.action.emit();
    }
}
