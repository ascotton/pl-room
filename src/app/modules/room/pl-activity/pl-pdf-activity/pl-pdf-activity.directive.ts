import { Directive, ElementRef, Injector, SimpleChanges } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
    selector: 'pl-pdf-activity',
})
export class PLPDFActivityDirective extends UpgradeComponent {
    constructor(elementRef: ElementRef, injector: Injector) {
        super('pdfActivity', elementRef, injector);
    }
}
