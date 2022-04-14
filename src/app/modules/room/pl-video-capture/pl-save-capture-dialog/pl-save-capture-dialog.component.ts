import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export const CAPTURE_SAVE_MODE = {
    DEFAULT: 'default',
    ON_EXIT: 'on_exit',
    EXISTING: 'existing',
    INTERRUPTED: 'interrupted',
};
export interface PLSaveCaptureDialogData {
    saveMode: string;
    discard: boolean;
    clientName: string;
    sessionName: string;
}
@Component({
    selector: 'pl-save-capture-dialog.component',
    templateUrl: './pl-save-capture-dialog.component.html',
    styleUrls: ['./pl-save-capture-dialog.component.less'],
})
export class PLSaveCaptureDialogComponent implements OnInit, OnDestroy  {

    constructor(public dialogRef: MatDialogRef<PLSaveCaptureDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: PLSaveCaptureDialogData) {}

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    disableSave() {
        return this.data && this.data.sessionName && this.data.sessionName.length < 1;
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }
}
