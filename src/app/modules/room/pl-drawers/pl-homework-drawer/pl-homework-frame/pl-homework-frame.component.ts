import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, OnInit, Inject } from '@angular/core';
import { WindowChannel } from '@common/utils';
import { Student } from '../student.model';
import { environment } from '@root/src/environments/environment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const iFramePrefix = '@homework';

interface DialogData {
    student: Student;
}

@Component({
    selector: 'pl-homework-frame',
    templateUrl: 'pl-homework-frame.component.html',
    styleUrls: ['pl-homework-frame.component.less'],
})
export class PLHomeworkFrameComponent implements AfterViewInit, OnInit, OnDestroy {
    readonly flutterAppUrl = environment.apps.flutterApp.url;

    @ViewChild('homeworkFrame') homeworkFrame: ElementRef<HTMLIFrameElement>;

    private iFrameChannel: WindowChannel;
    private iFrameListeners: (() => void)[] = [];

    homeworkFrameUrl: string;
    isLoaded = false;

    constructor(
        private dialogRef: MatDialogRef<PLHomeworkFrameComponent>,
        @Inject(MAT_DIALOG_DATA) private data: DialogData,
    ) {}

    ngOnInit() {
        this.homeworkFrameUrl = this.buildFrameUrl();
    }

    ngAfterViewInit() {
        const iFrame = this.homeworkFrame.nativeElement;
        this.iFrameChannel = new WindowChannel(iFrame.contentWindow, this.flutterAppUrl);

        this.iFrameListeners.push(
            this.iFrameChannel.on(
                `${iFramePrefix}/close`,
                this.onIFrameClose.bind(this),
            ),
            this.iFrameChannel.on(
                `${iFramePrefix}/load`,
                this.onIFrameLoad.bind(this),
            ),
            this.iFrameChannel.on(`${iFramePrefix}/onPopState`, () => {
                this.onIFrameClose();
            }),
        );
    }

    ngOnDestroy() {
        this.iFrameListeners.forEach(l => l());
    }

    private buildFrameUrl() {
        const params = [];

        const { student } = this.data;

        params.push(student.uuid);
        params.push(student.display_name);

        return `${this.flutterAppUrl}/#/homework/${params.join('/')}`;
    }

    private onIFrameClose() {
        this.dialogRef.close();
    }

    private onIFrameLoad() {
        this.isLoaded = true;
    }
}
