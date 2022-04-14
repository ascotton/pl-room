import { Directive, ElementRef, Injector, SimpleChanges } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
    selector: 'pl-memory-activity',
})
export class PLMemoryActivityDirective extends UpgradeComponent {
    constructor(elementRef: ElementRef, injector: Injector) {
        super('memoryActivity', elementRef, injector);
    }
}
