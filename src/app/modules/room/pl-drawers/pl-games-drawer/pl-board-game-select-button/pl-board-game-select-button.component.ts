import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BoardGame } from '@modules/pl-games/pl-board-games/pl-board-games-factory.service';

@Component({
    selector: 'pl-board-game-select-button',
    templateUrl: './pl-board-game-select-button.component.html',
    styleUrls: ['./pl-board-game-select-button.component.less'],
})
export class PlBoardGameSelectButtonComponent implements OnInit {
    @Input() game: BoardGame;
    @Output() readonly boardGameSelectClicked = new EventEmitter<any>();

    constructor() { }

    ngOnInit(): void {
    }

    clicked(): void {
        this.boardGameSelectClicked.emit(this.game);
    }

}
