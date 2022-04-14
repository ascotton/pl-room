import { NgModule } from '@angular/core';

import { PLDrawerPanelComponent } from './pl-drawer-panel.component';
import { CommonModule } from '@angular/common';
import { PLExpansionPanelModule } from '@common/components';
import { PLIconModule } from '@root/src/lib-components';
import { PLDrawerPanelHeaderComponent } from './pl-drawer-panel-header.component';

const exported = [
    PLDrawerPanelComponent,
    PLDrawerPanelHeaderComponent,
];

@NgModule({
    imports: [
        CommonModule,
        PLIconModule,
        PLExpansionPanelModule,
    ],
    exports: [...exported],
    declarations: [...exported],
    providers: [],
})
export class PLDrawerPanelModule { }

export {
    PLDrawerPanelComponent,
    PLDrawerPanelHeaderComponent,
};
