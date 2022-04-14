import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'pl-drawer-panel-header',
    templateUrl: 'pl-drawer-panel-header.component.html',
    styleUrls: ['pl-drawer-panel-header.component.less'],
    encapsulation: ViewEncapsulation.None,
})

export class PLDrawerPanelHeaderComponent implements OnInit {
    @Input() expanded: boolean;

    constructor() { }

    ngOnInit() { }
}
