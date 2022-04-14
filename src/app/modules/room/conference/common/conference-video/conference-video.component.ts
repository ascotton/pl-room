import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'pl-conference-video',
    templateUrl: 'conference-video.component.html',
    styleUrls: ['conference-video.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ConferenceVideoComponent {

    @Input() public src: MediaStream;
    @Input() public isMirrored = false;
    @Input() public isRotated = false;

    @Output() public readonly played = new EventEmitter<Event>();

    constructor(
    ) {}

    onPlay(ev: Event) {
        this.played.emit(ev);
    }
}
