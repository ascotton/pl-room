import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GamePieceInstance } from '../pl-board-games-factory.service';
import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';

@Component({
    selector: 'pl-board-game-piece',
    templateUrl: './pl-board-game-piece.component.html',
    styleUrls: ['./pl-board-game-piece.component.less'],
})
export class PlBoardGamePieceComponent implements OnInit {
    @Input() piece: GamePieceInstance;
    @Output() readonly pieceUpdated = new EventEmitter<GamePieceInstance>();
    @Output() readonly pieceDragged = new EventEmitter<any>();
    @Output() readonly hoverOn = new EventEmitter<any>();
    @Output() readonly hoverOff = new EventEmitter<any>();

    hovering = false;

    constructor() {
    }

    ngOnInit(): void {
    }

    mousedDown() {
        // can't touch something already being dragged
        if (this.piece.dragging) {
            return;
        }
        this.piece.dragging = true;
        this.piece.selected = true;
        this.pieceUpdated.emit(this.piece);
    }

    mouseUp() {
        setTimeout(() => {
            this.piece.dragging = false;
            this.piece.selected = false;
            this.pieceUpdated.emit(this.piece);
        }, 100);
    }

    dragStarted(evt: CdkDragStart) {
        this.piece.dragging = true;
        this.pieceUpdated.emit(this.piece);
    }

    dragEnded(evt: CdkDragEnd) {
        evt.source.reset();
        this.piece.selected = false;
        this.piece.dragging = false;
        this.pieceDragged.emit({piece: this.piece, distance: evt.distance});
    }

    dragMoved(evt: CdkDragMove) {
    }
    mouseOver(event) {
        if (this.hoverOn.observers.length > 0) {
            this.hovering = true;
        }
    }
    mouseOut(event) {
        if (this.hoverOn.observers.length > 0) {
            this.hovering = false;
        }
    }
}
