import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { PLProfileMenuComponent } from './pl-profile-menu.component';
import { PLPermissionsModule } from '@root/src/app/common/auth';

const exportedComponents = [
    PLProfileMenuComponent,
];

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        PLPermissionsModule,
    ],
    exports: [...exportedComponents],
    declarations: [...exportedComponents],
    providers: [],
})
export class PLProfileMenuModule {
    constructor() {
    }
}
