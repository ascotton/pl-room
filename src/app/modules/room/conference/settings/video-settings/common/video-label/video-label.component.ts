import { Component, OnInit, OnDestroy } from '@angular/core';
import { VideoLabelService } from './video-label.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { take, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'pl-video-label',
    templateUrl: 'video-label.component.html',
    providers: [
        VideoLabelService,
    ],
})

export class VideoLabelComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    public formControl = new FormControl();

    constructor(
        private videoLabelService: VideoLabelService,
    ) {
    }

    ngOnInit() {
        this.subscriptions.push(
            this.setDefaultValue(),
            this.onValueChanged(),
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    private setDefaultValue() {
        return this.videoLabelService.displayName$.pipe(
            take(1),
        ).subscribe((displayName) => {
            this.formControl.setValue(displayName);
        });
    }

    private onValueChanged() {
        return this.formControl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
        ).subscribe((displayName) => {
            this.videoLabelService.setDisplayName(displayName);
        });
    }
}
