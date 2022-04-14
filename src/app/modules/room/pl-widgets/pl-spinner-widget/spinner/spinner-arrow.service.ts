import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { SpinnerRotator } from './spinner-rotator-service';
@Injectable()
export class SpinnerArrowService {
    private beginRotationSource = new Subject<void>();
    private finishRotationSource = new Subject<void>();
    beginRotation$ = this.beginRotationSource.asObservable();
    finishRotation$ = this.finishRotationSource.asObservable();

    context: CanvasRenderingContext2D;
    image: HTMLImageElement;
    imageLoaded: boolean;
    pixelRatio: number;
    width: number;
    height: number;
    halfWidth: number;
    halfHeight: number;
    canvas: HTMLCanvasElement;
    rotator: SpinnerRotator;

    constructor(private zone: NgZone) {
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.image = new Image;
        this.imageLoaded = false;

        this.pixelRatio = window.devicePixelRatio || 1;

        this.width = canvas.width / this.pixelRatio;
        this.height = canvas.height / this.pixelRatio;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;

        this.loadArrow();
    }

    refreshPixelRatio() {
        this.pixelRatio = window.devicePixelRatio || 1;

        this.width = this.canvas.width / this.pixelRatio;
        this.height = this.canvas.height / this.pixelRatio;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
    }

    draw() {
        if (!this.canvas) {
            return;
        }
        if (this.imageLoaded) {
            this.drawArrow();
        } else {
            this.image.addEventListener('load', () => {
                this.drawArrow();
                this.imageLoaded = true;
            });
        }
    }
    drawArrow() {
        const drawingHeight = this.image.height;
        const drawingWidth = this.image.width;
        let angle = 0;
        if (this.rotator) {
            angle = this.rotator.isFinished ? this.rotator.endAngle : this.rotator.next();
        }

        this.context.clearRect(0, 0, this.width, this.height);

        this.context.save();
        this.context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.context.shadowBlur = 5;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 4;
        this.context.translate(this.halfWidth, this.halfHeight);
        this.context.rotate(angle);
        this.context.scale(0.37, 0.37);
        this.context.drawImage(this.image, -drawingWidth / 2, -drawingHeight + 15);
        this.context.restore();
    }
    setCurrentAngle(angle) {
        if (this.rotator) {
            this.rotator.recalcRotationEnd(angle);
        }
        this.draw();
    }
    setRotator(rotator) {
        this.rotator = rotator;
        this.rotator.rotationFinished$.subscribe(() => this.finishRotationSource.next());
        this.beginRotationSource.next();
    }

    loadArrow() {

        this.image.src = '/assets/widgets/spinner-dial.svg';
    }
}
