import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PLWidgetsOverlayService {
    private scaledSource = new BehaviorSubject<number>(0);
    public scaled$ = this.scaledSource.asObservable();
    private activatedSource = new BehaviorSubject<boolean>(false);
    public activated$ = this.activatedSource.asObservable();

    actualWidth: number;

    constructor() {}

    // Show display layer
    activate() {
        this.activatedSource.next(true);
    }

    // Hide display layer
    deactivate() {
        this.activatedSource.next(false);
    }

    setWidthAndScale(actualWidth) {
        this.actualWidth = actualWidth;
        this.scale();
    }

    scale() {
        this.scaledSource.next(this.actualWidth / 1024);
    }
}
