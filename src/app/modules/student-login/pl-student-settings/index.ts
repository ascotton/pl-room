import { NgModule } from '@angular/core';

import { PLStudentSettingsComponent } from './pl-student-settings.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

const exportedComponents = [
    PLStudentSettingsComponent,
];

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
    ],
    exports: [...exportedComponents],
    declarations: [...exportedComponents],
    providers: [],
})
export class PLStudentSettingsModule { }
