import { Component, OnInit, Input, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { PLExpansionPanelComponent } from '@common/components/pl-expansion-panel';

@Component({
    selector: 'pl-drawer-panel',
    templateUrl: 'pl-drawer-panel.component.html',
    styleUrls: ['pl-drawer-panel.component.less'],
    encapsulation: ViewEncapsulation.None,
})

export class PLDrawerPanelComponent implements OnInit {
    @ViewChild(PLExpansionPanelComponent) panel: PLExpansionPanelComponent;
    @Output() readonly opened: EventEmitter<void> = new EventEmitter<void>();
    @Output() readonly closed: EventEmitter<void> = new EventEmitter<void>();
    @Output() readonly rightIconClick: EventEmitter<void> = new EventEmitter<void>();
    @Input() header: string;
    @Input() noExpand = false;
    @Input() rightIcon: string;

    constructor() { }

    ngOnInit() { }

    onRightIconClick() {
        this.rightIconClick.emit();
    }

    onPanelOpened() {
        this.opened.emit();
    }

    onPanelClosed() {
        this.closed.emit();
    }

    close() {
        this.panel.close();
    }

    open() {
        this.panel.open();
    }

    toggle() {
        this.panel.toggle();
    }
}
