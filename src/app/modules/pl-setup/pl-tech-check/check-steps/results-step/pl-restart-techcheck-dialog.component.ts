import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PLTechCheckService } from '../../pl-tech-check.service';

@Component({
    selector: 'pl-restart-techcheck-dialog',
    templateUrl: 'pl-restart-techcheck-dialog.component.html',
})
export class PLRestartTechcheckDialogComponent {
    constructor(private dialogRef: MatDialogRef<PLRestartTechcheckDialogComponent>,
                private techCheckService: PLTechCheckService) {}

    closeDialog() {
        this.dialogRef.close();
    }

    onConfirmRestart() {
        this.techCheckService.restartTechCheck();
        this.closeDialog();
    }

}
