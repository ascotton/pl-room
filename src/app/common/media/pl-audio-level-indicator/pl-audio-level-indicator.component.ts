import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

interface LevelSquare {
    isFilled: boolean;
}

@Component({
    selector: 'pl-audio-level-indicator',
    templateUrl: 'pl-audio-level-indicator.component.html',
    styleUrls: ['./pl-audio-level-indicator.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PLAudioLevelIndicatorComponent implements OnInit, OnChanges {
    private peak = 100;

    @Input() public level = 0;
    @Input() public maxSquares = 10;

    public levelSquares: LevelSquare[] = [];
    public squareWidth: number;

    constructor() { }

    ngOnInit() {
        this.squareWidth = this.getSquareWidth();
        this.levelSquares = this.generateLevelSquares();
    }

    ngOnChanges(changes: SimpleChanges) {
        const { level, maxSquares } = changes;

        if (maxSquares && maxSquares.currentValue !== maxSquares.previousValue) {
            this.squareWidth = this.getSquareWidth();
            this.levelSquares = this.generateLevelSquares();
            return;
        }

        if (level && level.currentValue !== level.previousValue) {
            this.levelSquares.forEach((square, i) => {
                square.isFilled = this.isSquareFilled(i);
            });
        }
    }

    private getSquareWidth() {
        return 100 / this.maxSquares;
    }

    private generateLevelSquares() {
        return [...Array(this.maxSquares).keys()].map((_, i) => ({
            isFilled: this.isSquareFilled(i),
        }));
    }

    private isSquareFilled(squareIndex: number) {
        if (!this.level) {
            return false;
        }
        if (this.level > this.peak) {
            this.peak = this.level;
        }
        const volumePercentage = (this.level * 100) / this.peak;
        const squarePercentage = ((squareIndex + 1) * 100) / this.maxSquares;
        return volumePercentage >= squarePercentage;
    }

}
