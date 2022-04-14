import { Directive, ElementRef, Injector, SimpleChanges } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
    selector: 'pl-youtube-activity',
})
export class PLYoutubeActivityDirective extends UpgradeComponent {
    constructor(elementRef: ElementRef, injector: Injector) {
        super('youtubeActivity', elementRef, injector);
    }
}
