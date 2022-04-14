import { Component, Input } from '@angular/core';

@Component({
    selector: 'pl-documentation-drawer',
    templateUrl: './pl-documentation-drawer.component.html',
    styleUrls:  ['./pl-documentation-drawer.component.less'],
})

export class PLDocumentationDrawerComponent {
    @Input() active = false;

    constructor(
    ) {
    }
}
