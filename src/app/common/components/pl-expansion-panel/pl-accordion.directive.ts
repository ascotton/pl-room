import { Directive } from '@angular/core';

let nextId = 0;

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: 'pl-accordion',
})
export class PLAccordionDirective {
    readonly id = `pl-accordion-${nextId++}`;

    constructor() {}
}
