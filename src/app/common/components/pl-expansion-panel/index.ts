import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PLExpansionPanelComponent } from './pl-expansion-panel.component';
import { PLPanelHeaderDirective } from './pl-expansion-panel-header.directive';
import { PLAccordionDirective } from './pl-accordion.directive';

const exported = [
    PLExpansionPanelComponent,
    PLPanelHeaderDirective,
    PLAccordionDirective,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [...exported],
    declarations: [...exported],
    providers: [],
})
export class PLExpansionPanelModule { }

export {
    PLExpansionPanelComponent,
    PLPanelHeaderDirective,
    PLAccordionDirective,
};
