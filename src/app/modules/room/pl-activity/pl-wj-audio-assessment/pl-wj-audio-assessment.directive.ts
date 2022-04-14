import { Directive, ElementRef, Injector, SimpleChanges } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
    selector: 'pl-wj-audio-assessment',
})
export class PLWjAudioAssessmentDirective extends UpgradeComponent {
    constructor(elementRef: ElementRef, injector: Injector) {
        super('wjAudioAssessment', elementRef, injector);
    }
}
