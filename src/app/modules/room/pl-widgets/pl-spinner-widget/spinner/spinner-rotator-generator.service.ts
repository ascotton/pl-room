import { Subscription } from 'rxjs';
import { SpinnerRotator } from './spinner-rotator-service';

export class SpinnerRotatorGeneratorService {
    startSector: number;
    endSector: number = null;
    numberOfSectors: any;
    subRef: Subscription;
    rotator: SpinnerRotator;
    constructor() {
    }

    init (numberOfSectors) {
        this.startSector = 0;
        this.endSector = 0;
        this.numberOfSectors = numberOfSectors || 0;
        this.rotator = null;
    }

    getRotator(obj) {
        const params = obj || {};
        if (params.start !== undefined) {
            this.startSector = params.start || 0;
        }
        this.endSector = params.end !== undefined ? (params.end || 0) : this.randomizerGenerator(this.numberOfSectors);
        if (this.subRef) {
            this.subRef.unsubscribe();
        }
        this.rotator = new SpinnerRotator(this.startSector, this.endSector, this.numberOfSectors);
        this.subRef = this.rotator.rotationFinished$.subscribe(() => this.setStartSector(this.endSector));
        return this.rotator;
    }

    randomizerGenerator(number) {
        return Math.floor((Math.random() * number));
    }

    setStartSector(start) {
        this.startSector = start || 0;
    }

    setNumberOfSectors(number) {
        const _number = number || 0;
        if (_number !== this.numberOfSectors) {
            this.numberOfSectors = _number;
        }
    }
}
