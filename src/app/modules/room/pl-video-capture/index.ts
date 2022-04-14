import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { VideoCaptureService } from './video-capture.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PLVideoCaptureComponent } from './pl-video-capture.component';
import { PLClientSelectDialogComponent } from './pl-client-select-dialog/pl-client-select-dialog.component';
import { PLSaveCaptureDialogComponent } from './pl-save-capture-dialog/pl-save-capture-dialog.component';
import { PLCapturePreviewDialogComponent } from './pl-capture-preview-dialog/pl-capture-preview-dialog.component';

import { PLCommonComponentsModule } from '@common/components';

import {
    PLDotLoaderModule,
} from '@root/index';

import { PLApiFileAmazonService } from '@lib-components/api/';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PLCommonComponentsModule,
        PLDotLoaderModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
    ],
    exports: [PLVideoCaptureComponent],
    declarations: [
        PLVideoCaptureComponent,
        PLClientSelectDialogComponent,
        PLCapturePreviewDialogComponent,
        PLSaveCaptureDialogComponent,
    ],
    providers: [VideoCaptureService, PLApiFileAmazonService],
})
export class PLVideoCaptureModule { }

export {
    PLVideoCaptureComponent,
};

export { VideoCaptureService } from './video-capture.service';
