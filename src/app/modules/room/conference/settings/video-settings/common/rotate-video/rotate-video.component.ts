import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RotateVideoService } from './rotate-video.service';

@Component({
    selector: 'pl-rotate-video',
    templateUrl: 'rotate-video.component.html',
    styleUrls: ['rotate-video.component.less'],
    providers: [
        RotateVideoService,
    ],
})

export class RotateVideoComponent implements OnInit {
    public isRotated$: Observable<boolean>;

    constructor(
        private rotateVideoService: RotateVideoService,
    ) {
        this.isRotated$ = rotateVideoService.isRotated$;
    }

    ngOnInit() { }

    rotate() {
        this.rotateVideoService.rotate();
    }

    derotate() {
        this.rotateVideoService.derotate();
    }
}
