import { Directive, ElementRef, Injector, SimpleChanges } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
    selector: 'pl-flashcards-activity',
})
export class PLFlashcardsActivityDirective extends UpgradeComponent {
    constructor(elementRef: ElementRef, injector: Injector) {
        super('flashcardsActivity', elementRef, injector);
    }
}
