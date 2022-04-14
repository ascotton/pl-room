import { Component, Input } from '@angular/core';
import { CHECK_STATUS } from '../../pl-tech-check.model';

@Component({
    selector: 'pl-permission-indicator',
    templateUrl: 'pl-permission-indicator.component.html',
})
export class PLPermissionIndicatorComponent {
    @Input() public status: string;
    PERMISSION_STATUS = CHECK_STATUS;
    constructor() { }

}
