import { Component, Input, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'pl-room-toolbar-button',
    templateUrl: 'pl-room-toolbar-button.component.html',
    styleUrls: ['./pl-room-toolbar-button.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLRoomToolbarButtonComponent implements OnInit {
    @Input() public icon = '';
    @Input() public label = '';
    @Input() public active = false;
    @Input() public showBadge = false;
    @Input() public isSvgIcon = false;
    @Input() public disabled = false;
    @Output() readonly action = new EventEmitter<void>();

    constructor() { }

    ngOnInit() { }

    onClick() {
        this.action.emit();
    }
}
