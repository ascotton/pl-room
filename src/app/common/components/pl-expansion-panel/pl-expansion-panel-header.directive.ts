import { HostListener, Host, Directive } from '@angular/core';
import { PLExpansionPanelComponent } from './pl-expansion-panel.component';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: 'pl-expansion-panel-header',
})
export class PLPanelHeaderDirective {
    constructor(@Host() public panel: PLExpansionPanelComponent) {}

    @HostListener('click') onClick() {
        this.panel.toggle();
    }
}
