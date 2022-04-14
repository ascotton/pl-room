import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PLYouTubeService } from './pl-you-tube.service';
import * as moment from 'moment';
import { FirebaseAppModel } from '@common/models/firebase/firebase-app-model.service';

export interface DialogData {
    youTubeData: any;
    youTubeUrl: string;
}

@Component({
    selector: 'pl-quick-youtube',
    templateUrl: './pl-quick-youtube.component.html',
    styleUrls: ['./pl-quick-youtube.component.less'],
})
export class PLQuickYoutubeComponent implements OnInit {
    youTubeUrl: string;
    youTubeData: any;
    dialogOpen: boolean;

    constructor(public dialog: MatDialog, private firebaseAppModel: FirebaseAppModel) {}

    ngOnInit(): void {
    }

    open(): void {
        if (this.dialogOpen) {
            return;
        }
        this.youTubeUrl = '';
        const dialogRef = this.dialog.open(PLQuickYoutubeDialogComponent, {
            width: '785px',
            height: '655px',
            panelClass: 'pl-dialog-container',
            data: { youTubeData: null, youTubeUrl: this.youTubeUrl },
        });
        this.dialogOpen = true;

        dialogRef.afterClosed().subscribe((result) => {
            this.dialogOpen = false;
            if (result) {
                this.youTubeUrl = result.youTubeUrl;
                this.youTubeData = result.youTubeData;
                this.openYouTubeInRoom();
            }
        });
    }

    openYouTubeInRoom() {
        if (this.youTubeUrl) {
            const activity =  {
                id: this.youTubeData.id,
                type: 'instant_youtube',
                activity_type: 'activity',
                activityId: `INSTANT_YOUTUBE_ACTIVITY_ID-${this.youTubeData.id}`,
                session_id: `INSTANT_YOUTUBE_SESSION_ID-${this.youTubeData.id}`,
                youTubeUrl: this.youTubeUrl,
                name: this.youTubeData.snippet.title,
                config: this.youTubeData.id,
            };

            if (!this.firebaseAppModel.app.activeActivity ||
                activity.id !== this.firebaseAppModel.app.activeActivity.id) {
                this.firebaseAppModel.setActiveActivity(activity);
            }
        }
    }

}

@Component({
    selector: 'pl-quick-youtube-dialog',
    templateUrl: 'pl-quick-youtube-dialog.component.html',
    styleUrls: ['./pl-quick-youtube.component.less'],
})
export class PLQuickYoutubeDialogComponent {

    @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef;
    emptyResults = false;
    searchError = false;
    videoFound = false;

    constructor(public dialogRef: MatDialogRef<PLQuickYoutubeDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData,
                private youTubeService: PLYouTubeService,
                private renderer: Renderer2) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    clearInput() { 
        this.data.youTubeUrl = '';
    }

    selectVideo() {
        const url = this.data.youTubeUrl;
        this.videoFound = false;
        this.data.youTubeData = null;
        this.renderer.setProperty(this.videoPlayer.nativeElement, 'innerHTML', '');
        this.youTubeService.youTubeIDSearch(url).subscribe(
            (result) => {
                this.searchError = false;
                if (result !== this.youTubeService.NO_RESULTS) {
                    this.emptyResults = false;
                    this.videoFound = true;
                    this.data.youTubeData = result;
                    this.data.youTubeData.duration = moment.duration(this.data.youTubeData.contentDetails.duration);
                    this.renderer.setProperty(this.videoPlayer.nativeElement, 'innerHTML',
                                              this.data.youTubeData.player.embedHtml);
                } else {
                    this.emptyResults = true;
                    this.videoFound = false;
                }
            },
            (error) => {
                this.searchError = true;
                this.videoFound = false;
                console.log('YouTube search error: ', error);
            }
        )

    }

}