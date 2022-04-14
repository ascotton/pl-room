import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PLExpansionPanelModule } from '@common/components';
import { PLDrawerPanelModule } from '../pl-drawer-panel';

import { PLHomeworkDrawerComponent } from './pl-homework-drawer.component';
import { PLStudentsWOPermissionComponent } from './pl-students-wo-permission/pl-students-wo-permission.component';
import { PLStudentsWPermissionComponent } from './pl-students-w-permission/pl-students-w-permission.component';
import { PLStudentsWPermissionFilterComponent } from './pl-students-w-permission-filter/pl-students-w-permission-filter.component';

import { HomeworkService } from './homework.service';
import { PLIconModule, PLModalModule, PLDotLoaderModule } from '@root/src/lib-components';
import { PLHomeworkFrameComponent } from './pl-homework-frame/pl-homework-frame.component';
import { PipeModule } from '@root/src/lib-components/pipes';

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PipeModule,
        PLIconModule,
        PLDotLoaderModule,
        PLModalModule,
        PLExpansionPanelModule,
        PLDrawerPanelModule,
        MatDialogModule,
        MatIconModule,
    ],
    exports: [PLHomeworkDrawerComponent],
    declarations: [
        PLHomeworkDrawerComponent,
        PLStudentsWOPermissionComponent,
        PLStudentsWPermissionComponent,
        PLStudentsWPermissionFilterComponent,
        PLHomeworkFrameComponent,
    ],
    providers: [HomeworkService],
})
export class PLHomeworkDrawerModule { }
