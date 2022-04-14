import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export enum PREVIEW_CHOICE {
    CANCEL = 'cancel',
    RETAKE = 'retake',
    TAKE_MORE = 'takeMore',
    SAVE = 'save',
};
export interface CapturePreviewData {
    imageUrls: string[];
    nextCaptureUrl: string;
}
@Component({
    selector: 'pl-capture-preview-dialog',
    templateUrl: './pl-capture-preview-dialog.component.html',
    styleUrls: ['./pl-capture-preview-dialog.component.less'],
})
export class PLCapturePreviewDialogComponent implements OnInit, OnDestroy  {
    imageUrls: string[];
    nextCaptureUrl: string;

    constructor(public dialogRef: MatDialogRef<PLCapturePreviewDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: CapturePreviewData) {
        this.imageUrls = data.imageUrls;
        this.nextCaptureUrl = data.nextCaptureUrl;
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    onCancelClick(): void {
        this.dialogRef.close(PREVIEW_CHOICE.CANCEL);
    }

    onRetakeClick(): void {
        this.dialogRef.close(PREVIEW_CHOICE.RETAKE);
    }

    onTakeMoreClick(): void {
        this.dialogRef.close(PREVIEW_CHOICE.TAKE_MORE);
    }

    onSaveClick(): void {
        this.dialogRef.close(PREVIEW_CHOICE.SAVE);
    }

}