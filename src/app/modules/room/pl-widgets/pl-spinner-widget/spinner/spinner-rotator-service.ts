import { Subject } from 'rxjs';

export class SpinnerRotator {
    private rotationFinishedSource = new Subject<void>();
    rotationFinished$ = this.rotationFinishedSource.asObservable();
    revolutions: number;
    duration: number;
    originalStart: number;
    originalEnd: number;
    numberOfSectors: number;
    sectorSize: number;
    startAngle: number;
    endAngle: number;
    overallTime: number;
    range: number;
    isFinished: boolean;
    lastTickTime: number;

    constructor(start, end, numberOfSectors) {
        const DURATION = 3000;
        const REVOLUTIONS = 2;

        this.revolutions = REVOLUTIONS;
        this.duration = DURATION;
        this.originalStart = start;
        this.originalEnd = end;
        this.numberOfSectors = numberOfSectors || 0;

        this.sectorSize = 2 * Math.PI / this.numberOfSectors;

        this.startAngle = start * this.sectorSize;
        this.endAngle = end * this.sectorSize;
        this.overallTime = 0;
        this.range = this.revolutions * 2 * Math.PI;
        if (start > end) {
            this.range += (Math.PI * 2 - this.startAngle) + this.endAngle;
        } else {
            this.range += (this.endAngle - this.startAngle);
        }
        this.isFinished = false;
        this.lastTickTime = Date.now();
    }

    recalcRotationEnd(numberOfSectors) {
        this.numberOfSectors = numberOfSectors || 0;
        this.sectorSize = 2 * Math.PI / this.numberOfSectors;
        const end = this.originalEnd < this.numberOfSectors ? this.originalEnd : 0;
        return (this.endAngle = end * this.sectorSize);
    }

    increaseOverallTime(time) {
        const newTime = this.overallTime + time;
        this.overallTime = newTime > this.duration ? this.duration : newTime;
        this.lastTickTime = Date.now();
    }

    next() {
        const deltaT = Date.now() - this.lastTickTime;
        const EXP_CONST = 5;
        if (this.isFinished) {
            this.rotationFinishedSource.next();
            return this.endAngle;
        }
        let nextAngle = 0;
        this.overallTime += deltaT;
        this.overallTime = Math.min(this.overallTime, this.duration);

        // subtract from one to rotate CW
        const factor = 1 - Math.exp(-1 * EXP_CONST * this.overallTime / this.duration);
        nextAngle = this.startAngle + factor * this.range;
        // normalize next angle
        const currentRev = Math.floor(nextAngle / (Math.PI * 2));
        nextAngle = nextAngle - currentRev * Math.PI * 2;
        if (this.overallTime >= this.duration) {
            this.isFinished = true;
            this.rotationFinishedSource.next();
            nextAngle = this.endAngle;
        }
        this.lastTickTime =  Date.now();
        return nextAngle;
    }
}
