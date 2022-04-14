import { Directive, ElementRef, Injector, SimpleChanges } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
    selector: 'pl-double-assessment-activity',
})
export class PLDoubleAssessmentActivityDirective extends UpgradeComponent {
    constructor(elementRef: ElementRef, injector: Injector) {
        super('doubleAssessmentActivity', elementRef, injector);
    }
}
