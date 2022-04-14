import { Component,
                Input,
                OnChanges,
                OnInit,
                OnDestroy,
                ElementRef,
                NgZone,
            } from '@angular/core';

import { Store } from '@ngrx/store';
import { AngularCommunicatorService } from
    '@app/downgrade/angular-communicator.service';

import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';

import  {
    GamePieceInstance,
    GameRegion,
} from './pl-board-games-factory.service';
import { selectCurrentUser } from '@modules/user/store';
import { AppState } from '@app/store';

import { updateGame, GameActions } from '@modules/pl-games/store';

@Component({
    selector: 'pl-board-games',
    templateUrl: './pl-board-games.component.html',
    styleUrls: ['./pl-board-games.component.less'],
})
export class PlBoardGamesComponent implements OnInit, OnDestroy, OnChanges {
    @Input() active = false;

    pieces: GamePieceInstance[] = [];
    gameBoardImgSrc: string;

    selectedPiece: GamePieceInstance;
    lastStickerDragX: number;
    lastStickerDragY: number;
    isOverTray = false;

    gamesStateRef: any;
    currentGameInstanceRef: any;

    storeSubscription: any;
    isProvider: boolean;

    trashPiece: any;
    trashHovering: boolean;
    firebaseGamePath: string;
    queuedBoardGameImageSrcUpdate: any;

    startRegion: any;
    currentGameIdRef: any;
    currentGameName: any;
    currentGameId = '';
    gameSplashScreenSrc: string;

    constructor(
        public angularCommunicator: AngularCommunicatorService,
        private element: ElementRef,
        private store: Store<AppState>,
        private zone: NgZone,
    ) {
    }

    ngOnInit() {
        // disabling trash, but I suspect we will restore it in a release soon
        // this.trashPiece = this.factory.getGamePieceInstance(this.factory.getGamePieceType('trash'));
        // this.trashPiece.x = 80;
        // this.trashPiece.y = 2;

        this.initFirebase();

        this.store.select(selectCurrentUser)
            .subscribe((user) => {
                if (user && user.groups) {
                    this.isProvider = user.groups.indexOf('Provider') > -1 ||
                                      user.groups.indexOf('Service & Support') > -1 ||
                                      user.groups.indexOf('School Staff Providers') > -1 ||
                                      user.groups.indexOf('Private Practice') > -1;
                }
            });

        this.storeSubscription = this.store.select(updateGame).subscribe(
            (state) => {
                if (state.action && state.action.type === '/game/addPiece') {
                    this.addPiece(state.action.piece, this.startRegion);
                }
            },
        );
    }

    initFirebase() {
        this.gamesStateRef = this.angularCommunicator.getFirebaseRef('games');
        this.gamesStateRef.child('boardGames').child('currentGame').on('value', (snap) => {
            const currentGameName = snap.val();
            if (currentGameName) {
                this.updateFirebaseCurrentGameNameRef(currentGameName);
            }
        });

        this.gamesStateRef.child('boardGames').child('splashScreenSrc').on(
            'value',
            snap => {
                this.setGameSplashScreenSrc(snap.val());
            });
    }

    pieceRemovedInFb = (snap) => {
        this.zone.run(() => {
            const removedPiece = snap.val();
            const existing = this.pieces.find(piece => piece.key === removedPiece.key);
            if (existing) {
                existing.fadeOut = true;
                // give 250ms for the fadeout animation to run
                setTimeout(() => {
                    const newPieces = this.pieces.filter(piece => piece.key !== removedPiece.key);
                    this.pieces = newPieces;
                    this.store.dispatch(GameActions.removePiece({ piece: removedPiece }));
                },         250);
            }
            this.pieces = this.pieces.sort((a, b) => a.updated - b.updated);
        });
    }

    pieceUpdatedInFb = (snap) => {
        this.zone.run(() => {
            const updatedPiece = snap.val();
            const existing = this.pieces.find(piece => piece.key === updatedPiece.key);
            if (existing) {
                existing.dragging = updatedPiece.dragging;
                existing.updated = updatedPiece.updated;
                // only animate if properties differ, meaning the change was remote, otherwise user
                // sees the piece jump back and move again after they already dragged it
                if (existing.x !== updatedPiece.x ||
                    existing.y !== updatedPiece.y
                    ) {
                    existing.remoteChange = true;
                    existing.x = updatedPiece.x;
                    existing.y = updatedPiece.y;
                    // give 350ms for animation to complete before unsetting remote change
                    setTimeout(() => {
                        existing.remoteChange = false;
                    },         350);
                }
            } else {
                this.pieces.push(updatedPiece);
            }
            this.pieces = this.pieces.sort((a, b) => a.updated - b.updated);

        });
    }

    ngOnChanges(changesEvent) {
        // console.log('changes: ', changesEvent);
    }

    fbUpdatePiece(piece: GamePieceInstance) {
        piece.updated = new Date().getTime();
        this.currentGameInstanceRef.child('pieces/' + piece.key).update(piece);
        this.currentGameInstanceRef.child('modified').set(new Date().getTime());
    }

    resetValues() {
        this.pieces = [];
        this.gameBoardImgSrc = '';
    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
        this.currentGameInstanceRef.child('pieces').off('child_added', this.pieceUpdatedInFb);
        this.currentGameInstanceRef.child('pieces').off('child_changed', this.pieceUpdatedInFb);
        this.currentGameInstanceRef.child('pieces').off('child_removed', this.pieceRemovedInFb);
    }

    updateFirebaseGameInstanceRef() {
        this.clearPieces();
        if (this.currentGameInstanceRef) {
            this.currentGameInstanceRef.child('pieces').off('child_added', this.pieceUpdatedInFb);
            this.currentGameInstanceRef.child('pieces').off('child_changed', this.pieceUpdatedInFb);
            this.currentGameInstanceRef.child('pieces').off('child_removed', this.pieceRemovedInFb);
        }
        if (!this.currentGameName || !this.currentGameId) {
            this.setGameBoardImageSrc('');
        } else {
            this.currentGameInstanceRef = this.angularCommunicator.getFirebaseRef(`games/boardGames/${this.currentGameName}/instances/${this.currentGameId}`);
            this.currentGameInstanceRef.child('pieces').on('child_added', this.pieceUpdatedInFb);
            this.currentGameInstanceRef.child('pieces').on('child_changed', this.pieceUpdatedInFb);
            this.currentGameInstanceRef.child('pieces').on('child_removed', this.pieceRemovedInFb);

            this.currentGameInstanceRef.child('gameBoardImgSrc').once(
                'value', snap => this.setGameBoardImageSrc(snap.val()));

            this.currentGameInstanceRef.child('startRegion').once('value', snap => this.startRegion = snap.val());
        }
    }

    updateFirebaseCurrentGameNameRef(gameName) {
        if (this.currentGameIdRef) {
            this.currentGameIdRef.off('value', this.gameIdUpdated);
        }
        this.currentGameName = gameName;
        this.currentGameId = null;
        this.currentGameIdRef = this.angularCommunicator.getFirebaseRef(`games/boardGames/${gameName}/currentGameId`);
        this.currentGameIdRef.on('value', this.gameIdUpdated);
    }

    gameIdUpdated = (snap) => {
        this.currentGameId = snap.val();
        this.updateFirebaseGameInstanceRef();
    }

    private setGameBoardImageSrc(src: string) {
        this.zone.run(() => {
            this.gameBoardImgSrc = src;
        });
    }

    private setGameSplashScreenSrc(src: string) {
        this.zone.run(() => {
            this.gameSplashScreenSrc = src;
        });
    }

    addPiece(piece: GamePieceInstance, startRegion?: GameRegion) {
        this.positionPiece(piece, startRegion);

        const newPostKey = this.currentGameInstanceRef.child('pieces').push().key;
        piece.key = newPostKey;
        this.fbUpdatePiece(piece);
        this.pieces.push(piece);
        return piece;
    }

    private clearPieces() {
        this.pieces = [];
    }

    private positionPiece(piece: GamePieceInstance, startRegion?: GameRegion) {
        if (startRegion) {
            const xFactor = Math.random();
            const yFactor = Math.random();
            piece.x = startRegion.left + xFactor * (startRegion.right - startRegion.left) - piece.width / 2;
            piece.y = startRegion.top + yFactor * (startRegion.bottom - startRegion.top) - piece.height / 2;
        } else {
            piece.x = Math.random() * (100 - piece.width);
            piece.y = Math.random() * (100 - piece.height);
        }
    }

    pieceUpdated(piece: GamePieceInstance) {
        if (this.selectedPiece && this.selectedPiece !== piece) {
            this.selectedPiece.selected = false;
            this.selectedPiece = piece;
        }
        if (piece.dragging) {
            // splice the piece out and push to the end of the array so it lands on top of the stack of pieces
            // in rendering
            this.pieces.splice(this.pieces.indexOf(piece), 1);
            this.pieces.push(piece);
        }
        this.fbUpdatePiece(piece);
    }

    pieceDragEnded(dragEvent: any) {
        const piece = dragEvent.piece;
        const distance = dragEvent.distance;

        const boundrect = this.element.nativeElement.getBoundingClientRect();
        piece.x += 100 * distance.x / boundrect.width;
        piece.y += 100 * distance.y / boundrect.height;

        const pieceRight = piece.x + piece.width;
        const pieceBottom = piece.y + piece.height;

        const existing = this.pieces.find(p => p.key === piece.key);
        if (existing) {
            existing.x = piece.x;
            existing.y = piece.y;
        }

        if (piece.x > 100 || pieceRight < 1 || piece.y > 100 || pieceBottom < 0) {
            if (this.isProvider && piece.x > 100) {  // if provider drags off workspace, delete piece
                this.currentGameInstanceRef.child('pieces/' + piece.key).remove();
                return;
            } else { // if student drags off workspace, nudge it back
                // piece.x = piece.x > 100 ? this.trayLeftPercent + 1 : piece.x;
                piece.x = pieceRight < 1 ? 0 : piece.x;
                piece.y = piece.y > 99 ? 95 : piece.y;
                piece.y = pieceBottom < 1 ? 0 : piece.y;
            }
        }
        this.fbUpdatePiece(piece);
    }
    trashHoverOff($event) {
        this.trashHovering = false;
    }

    trashHoverOn($event) {
        this.trashHovering = true;
    }
}
