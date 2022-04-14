import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StreamSettingsComponent } from '../stream-settings.component';

@Component({
    selector: 'pl-stream-settings-action',
    templateUrl: 'stream-settings-action.component.html',
})

export class StreamSettingsActionComponent implements OnInit {
    @Input() private participantId: string;

    constructor(
        private dialog: MatDialog,
    ) { }

    ngOnInit() { }

    showSettings() {
        this.dialog.open(StreamSettingsComponent, {
            data: { participantId: this.participantId },
            panelClass: 'spacing-0',
            width: '370px',
            height: '80%',
        });
    }
}
