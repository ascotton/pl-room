import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'pl-audio-level-indicator',
    templateUrl: 'pl-audio-level-indicator.component.html',
    styleUrls: ['./pl-audio-level-indicator.component.less'],
})
export class PLAudioLevelIndicatorComponent implements OnInit {
    @Input() public level: number;
    @Input() public maxSquares = 10;
    private peak = 100;
    constructor() { }

    ngOnInit() {

    }

    isSquareFilled(squareIndex) {
        if (!this.level) {
            return false;
        }
        if (this.level > this.peak) {
            this.peak = this.level;
        }
        const volumePercentage = (this.level * 100) / this.peak;
        const squarePorcentage = ((squareIndex + 1) * 100) / this.maxSquares;
        return volumePercentage >= squarePorcentage;
    }

    counter(i: number) {
        return new Array(i);
    }

}
