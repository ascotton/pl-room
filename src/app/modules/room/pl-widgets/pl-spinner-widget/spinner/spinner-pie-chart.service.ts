import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SpinnerPieChartService {
    private drawSource = new Subject<void>();
    private drawnSource = new Subject<void>();
    draw$ = this.drawSource.asObservable();
    drawn$ = this.drawnSource.asObservable();
    context: any;
    gradientCanvas: any;
    gradientContext: any;
    numberOfSectors: any;
    data: any[];
    width: any;
    height: any;
    halfWidth: number;
    halfHeight: number;
    fontSize: number;
    canvas;

    constructor() {
    }

    init(canvas, numberOfSectors, gradientCanvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.gradientCanvas = gradientCanvas;
        this.gradientContext = gradientCanvas ? gradientCanvas.getContext('2d') : null;

        this.numberOfSectors = numberOfSectors || 0;
        this.data = this.calculateData(this.numberOfSectors);

        this.width = canvas.width;
        this.height = canvas.height;
        this.halfWidth = canvas.width / 2;
        this.halfHeight = canvas.height / 2;

        const pixelRatio = window.devicePixelRatio || 1;
        this.fontSize = 18 * pixelRatio;
    }

    refreshPixelRatio() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;

        const pixelRatio = window.devicePixelRatio || 1;
        this.fontSize = 18 * pixelRatio;
    }

    draw() {
        this.clearCanvas();
        this.drawBackground();
        this.drawPieChart();
        if (this.gradientContext) {
            this.drawGradient();
        }
        this.drawnSource.next();
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    setNumberOfSectors(numberOfSectors) {
        if (this.numberOfSectors === numberOfSectors) {
            return;
        }
        this.numberOfSectors = numberOfSectors || 0;
        this.data = this.calculateData(this.numberOfSectors);
        this.drawSource.next();
    }

    drawPieChart() {
        const colors = ['#D9253D', '#EDA12D', '#F2E81C', '#CAD732', '#2A9A47',
            '#106C8B', '#435393', '#574B8D', '#915995', '#CC1A67'];

        for (let i = 0; i < this.numberOfSectors; i++) {
            const segmentAngle = this.drawSegment(i, colors[i]);
            this.drawSegmentLabel(i, segmentAngle);
        }
    }

    degreesToRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }
    sumTo(a, i) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
            sum += a[j];
        }
        return sum;
    }

    drawBackground() {
        this.context.save();

        this.context.shadowColor = 'rgba(0, 0, 0, 50)';
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 1;
        this.context.shadowBlur = 4;

        this.context.beginPath();

        this.context.moveTo(this.halfWidth, this.halfHeight);

        this.context.strokeStyle = '#ffffff';

        this.context.arc(this.halfWidth, this.halfHeight, this.halfWidth - 6, 0, 2 * Math.PI);

        this.context.stroke();

        this.context.restore();
    }

    drawSegment(i, color) {
        const startingAngle = this.degreesToRadians(this.sumTo(this.data, i) - 90 - this.data[0] / 2);
        const arcSize = this.degreesToRadians(this.data[i]);
        const endingAngle = startingAngle + arcSize;
        const intermediateAngle = startingAngle + arcSize / 2;

        this.context.save();

        this.context.beginPath();
        this.context.moveTo(this.halfWidth, this.halfHeight);
        this.context.arc(this.halfWidth, this.halfHeight, this.halfWidth - 7, startingAngle, endingAngle, false);
        this.context.closePath();

        this.context.fillStyle = color;
        this.context.fill();

        this.context.restore();

        return intermediateAngle;
    }

    drawSegmentLabel(i, angle) {
        const label = i + 1 + '';

        this.context.save();

        const dx = this.halfWidth + Math.cos(angle) * this.width * 0.75 / 2;
        const dy = this.halfHeight + Math.sin(angle) * this.height * 0.75 / 2;

        this.context.textAlign = 'right';
        // Source Sans Pro causes initial load in Firefox to have missing numbers sometimes.
        // this.context.font = 'bold ' + this.fontSize + 'px Source Sans Pro, sans-serif'; // fontSize + "pt Open Sans";
        this.context.font = 'bold ' + this.fontSize + 'px sans-serif';
        this.context.fillStyle = 'white';
        this.context.fontWeight = 700;
        this.context.shadowColor = 'rgba(124, 121, 121, 0.5)';
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 1;
        this.context.shadowBlur = 3;

        const textOffset = this.context.measureText(label).width / 2;

        this.context.fillText(label, dx + textOffset, dy + textOffset);

        this.context.restore();
    }
    drawGradient() {
        this.gradientContext.save();

        this.gradientContext.clearRect(0, 0, this.width, this.height);

        this.gradientContext.rect(0, 0, this.width, this.height);

        this.gradientContext.translate(this.halfWidth, this.halfHeight);

        const grd = this.gradientContext.createRadialGradient(0, 0, 80, 0, 0, 20);

        grd.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grd.addColorStop(1, 'rgba(255, 255, 255, 0.27)');

        this.gradientContext.fillStyle = grd;
        this.gradientContext.fill();

        this.gradientContext.restore();
    }
    calculateData(numberOfPieces) {
        const res = [];
        for (let i = 0; i < numberOfPieces; i++) {
            res.push(360 / numberOfPieces);
        }
        return res;
    }
}
