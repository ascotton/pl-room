import { Directive, ElementRef, Injector, SimpleChanges } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
    selector: 'pl-guess-who-board',
})
export class PLGuessWhoBoardDirective extends UpgradeComponent {
    constructor(elementRef: ElementRef, injector: Injector) {
        super('guessWhoBoard', elementRef, injector);
    }
}
