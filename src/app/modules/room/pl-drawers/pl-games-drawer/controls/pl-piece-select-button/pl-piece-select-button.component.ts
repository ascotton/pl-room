import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GamePieceSetup } from '@root/src/app/modules/pl-games/pl-board-games/pl-board-games-factory.service';

@Component({
    selector: 'pl-piece-select-button',
    templateUrl: './pl-piece-select-button.component.html',
    styleUrls: ['./pl-piece-select-button.component.less'],
})
export class PLPieceSelectButtonComponent implements OnInit {
    @Input() pieceSetup: GamePieceSetup;
    @Output() readonly pieceClickedEvent = new EventEmitter<any>();
    disabled = false;

    constructor() { }

    ngOnInit(): void {
    }

    clickedPiece() {
        this.pieceClickedEvent.emit(this.pieceSetup);
    }

    isDisabled() {
        return this.pieceSetup.usedCount >= this.pieceSetup.count;
    }
}
