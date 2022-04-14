import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BoardGame, GamePieceType, GamePieceSetup, GamePieceInstance, PLBoardGamesFactoryService } from '@modules/pl-games/pl-board-games/pl-board-games-factory.service';
import { Store } from '@ngrx/store';
import { AppState } from '@root/src/app/store';

import { GameActions, GameCategoryType, updateGame } from '@modules/pl-games/store';
import { AngularCommunicatorService } from '@root/src/app/downgrade/angular-communicator.service';
import { PLDrawerPanelComponent } from '../../../pl-drawer-panel/pl-drawer-panel.component';
import { PLWidgetsBoardModelService } from '@modules/room/pl-widgets/pl-widgets-board/pl-widgets-board-model.service';
import { PLSpinnerWidgetService } from '@modules/room/pl-widgets/pl-spinner-widget/pl-spinner-widget.service';
import { PLDiceWidgetService } from '@modules/room/pl-widgets/pl-dice-widget/pl-dice-widget.service';
import { ThrowStmt } from '@angular/compiler';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';

@Component({
    selector: 'pl-board-game-controls',
    templateUrl: './pl-board-game-controls.component.html',
    styleUrls: ['./pl-board-game-controls.component.less'],
})
export class PLBoardGameControlsComponent implements OnInit {
    @Input() gameName: string;
    @ViewChild('instancesPanel') instancesPanel: PLDrawerPanelComponent;

    firebaseGamePath: string;
    boardGamesStateRef: any;
    currentGameInstanceRef: any;
    currentPieceSetups: any;

    game: BoardGame;
    currentGameKey: number;
    instances: any[];
    currentInstance: any;
    widget: any;
    changeTimer: any;
    widgetRef: any;
    currentGameName: any;
    totalUsedPieceCount: number;
    loadingGame: any;
    trashingGame: boolean;
    gamesStateRef: any;
    boardGamesActive: any;
    gamesActive: boolean;

    constructor(
        private store: Store<AppState>,
        private boardGameFactory: PLBoardGamesFactoryService,
        public angularCommunicator: AngularCommunicatorService,
        private widgetsBoardModel: PLWidgetsBoardModelService,
        private spinnerWidgetService: PLSpinnerWidgetService,
        private diceWidgetService: PLDiceWidgetService,
        private currentUserModel: CurrentUserModel,
    ) { }

    ngOnInit(): void {
        this.initFirebase();
    }
    initFirebase() {
        this.store.select('firebaseStateStore').subscribe(
            (data: any) => {
                if (!data) {
                    return;
                }
                const type = data.type;
                const payload = data.payload;
                switch (type) {
                        case 'FIREBASE_UPDATE':
                            if (this.gamesActive !== payload.gamesActive) {
                                this.gamesActive = payload.gamesActive;
                                setTimeout(() => {
                                    this.toggleWidgets(this.gamesActive);
                                }, 100);
                            }
                            return;
                }
            },
        );

        this.boardGamesStateRef = this.angularCommunicator.getFirebaseRef('games/boardGames');
        this.boardGamesStateRef.child('currentGame').once('value', (snap) => {
            const val = snap.val();
            if (val) {
                this.gameName = val;
                this.currentGameName = val;
                this.game = this.boardGameFactory.getBoardGame(this.gameName);
                this.currentPieceSetups = [...this.game.pieceSetups];

                this.store.dispatch(GameActions.start({ gameCategory: GameCategoryType.BoardGame, game: this.game }));

                this.boardGamesStateRef.child('currentPath').once('value', (snap) => {
                    this.firebaseGamePath = snap.val();
                    this.currentGameInstanceRef = this.angularCommunicator.getFirebaseRef(`games/boardGames/${this.firebaseGamePath}`);
                    this.updatePieceSetups();
                });

                this.boardGamesStateRef.child(this.game.name).child('currentGameId').once('value', (snap) => {
                    this.currentGameKey = snap.val();
                    this.updateInstances();
                });
            }
        });
        this.boardGamesStateRef.child('currentWidgets').once('value', (snap) => {
            snap.forEach((childSnap) => {
                const id = childSnap.val();
                this.widgetRef = this.widgetsBoardModel.getWidgetReferenceById(id);
                this.widgetRef.once('value', snap => {
                    this.widget = snap.val();
                    if (this.widget) {
                        this.widget.key = id;
                    }
                });
            });

        });
    }

    private updateInstances() {
        const newInstances = [];
        this.boardGamesStateRef.child(this.game.name).child('instances').once('value', (snap) => {
            snap.forEach((childSnap) => {
                const key = childSnap.key;
                const childData = childSnap.val();
                const instance = Object.assign({ key }, childData);
                instance.current = instance.key === this.currentGameKey;
                if (instance.current) {
                    this.currentInstance = instance;
                }
                newInstances.push(instance);
            });
            newInstances.sort((a, b) => a.modified <  b.modified ? 1 : -1);
            this.instances = newInstances;
            if (this.instancesPanel && this.instances.length > 0) {
                this.instancesPanel.open();
            }
        });
    }

    ngOnChanges(event) {
        if (event.gameName && this.gameName) {
            this.game = this.boardGameFactory.getBoardGame(this.gameName);
            this.currentPieceSetups = [...this.game.pieceSetups];
            this.boardGamesStateRef.child('browsingGame').set(this.game.name);
            if (this.game.splashScreenSrc) {
                this.boardGamesStateRef.child('splashScreenSrc').set(this.game.splashScreenSrc);
            }
            this.updateInstances();
        }
    }

    toggleWidgets(val) {
        if (this.widget) {
            this.widget.hidden = !val;
            if (this.currentUserModel.user.isClinicianOrExternalProvider()) {
                this.widgetsBoardModel.updateWidgetByKey(this.widget.key, this.widget);
            }
        }
    }

    // Currently just handle exactly one game widget, in future could do multiple
    setupGameWidgets() {
        this.boardGamesStateRef.child('currentWidgets').once('value',  (snap) => {
            snap.forEach((childSnap) => {
                const id = childSnap.val();
                this.widgetsBoardModel.deleteWidgetById(id);
            });

            let widgetConfig = {};
            let widgetX;
            let widgetY;
            const widget = this.game.widget;
            const widgetType = this.game.widgetType; // support deprecated "widgetType"
            if (widget) {
                if (widget.type === 'spinner-widget') {
                    widgetConfig = this.spinnerWidgetService.config;
                } else if (widget.type === 'dice-widget') {
                    widgetConfig = this.diceWidgetService.config;
                }
                widgetX = widget.startX;
                widgetY = widget.startY;
            } else if (widgetType) {
                if (widgetType === 'spinner-widget') {
                    widgetConfig = this.spinnerWidgetService.config;
                    widgetX = 0.43;
                    widgetY = 0.4;
                } else if (widgetType === 'dice-widget') {
                    widgetConfig = this.diceWidgetService.config;
                    widgetX = 0.4;
                    widgetY = 0.85;
                }
            }
            if (widget || widgetType) {
                this.widgetRef = this.widgetsBoardModel.createWidgetProportional(widgetConfig, widgetX, widgetY);
                this.boardGamesStateRef.child('currentWidgets').remove();
                this.boardGamesStateRef.child('currentWidgets').push(this.widgetRef.key);

                this.widgetRef.once('value', snap => {
                    this.widget = snap.val();
                    this.widget.key = this.widgetRef.key;
                });
            }
        });
    }

    clearInstances() {
        this.instances.forEach(instance => {
            if (!instance.current) {
                this.boardGamesStateRef.child(this.game.name).child('instances').child(instance.key).remove();
            }
        });
        setTimeout(() => { this.updateInstances(); }, 100);
    }

    clearBoard() {
        this.currentGameInstanceRef.child('pieces').remove();
        this.totalUsedPieceCount = 0;
    }

    pieceClicked(pieceSetup: GamePieceSetup) {
        if (this.currentGameName !== this.gameName) {
            return;
        }
        if (pieceSetup.usedCount < pieceSetup.count) {
            const piece: GamePieceInstance = this.boardGameFactory.getGamePieceInstance(pieceSetup.type);
            this.store.dispatch(GameActions.addPiece({ piece }));
        } else if (pieceSetup.count === 1 && pieceSetup.usedCount >= 1) {
            this.findAndRemoveFirst(pieceSetup);
        }
        let newUsedCount = 0;
        this.game.pieceSetups.forEach(setup => {
            newUsedCount += setup.usedCount;
        });
        this.totalUsedPieceCount = newUsedCount;
    }
    findAndRemoveFirst(setup: GamePieceSetup) {
        let removeKey: any;
        this.currentGameInstanceRef.child('pieces').once('value', snap => {
            const pieces = snap.val()
            for (const key in pieces) {
                if (key) {
                    const piece = pieces[key];
                    if (piece.name === setup.type.name) {
                        removeKey = key;
                        break;
                    }
                }
            }
            this.currentGameInstanceRef.child('pieces').child(removeKey).remove().then(() => {
                setup.usedCount--;
            });
        });
    }

    loadGame(event) {
        if (!this.loadingGame) {
            this.loadingGame = true;
            this.currentGameKey = event.key;
            this.currentGameName = this.gameName;
            this.instances = this.instances.map(
                (instance) => {
                    instance.current = instance.key === event.key;
                    return instance;
                },
            );
            this.updateRefs();
            this.updatePieceSetups();
            this.setupGameWidgets();
            this.updateInstances();
        }
        // throttle by 1000ms
        setTimeout(() => this.loadingGame = false, 1000);
    }

    trashGame(event) {
        this.trashingGame = true;
        const trashed = this.instances.find(instance => instance.key === event);
        if (trashed.current) {
            this.boardGamesStateRef.child('currentGame').remove();
            this.boardGamesStateRef.child('currentPath').remove();
            this.boardGamesStateRef.child(this.game.name).child('currentGameId').remove();
            this.currentGameName = '';
            this.widget = null;
            this.boardGamesStateRef.child('currentWidgets').once('value',  (snap) => {
                snap.forEach((childSnap) => {
                    const id = childSnap.val();
                    this.widgetsBoardModel.deleteWidgetById(id);
                });
                this.boardGamesStateRef.child('currentWidgets').remove();
            });
        }
        this.boardGamesStateRef.child(this.game.name).child('instances').child(event).remove();
        this.updateInstances();
        // throttle by 500ms
        setTimeout(() => this.trashingGame = false, 1000);
    }

    gameInstanceNameChanged(event) {
        const gamePath = `${this.game.name}/instances/${event.key}`;
        this.boardGamesStateRef.child(gamePath).child('name').set(event.name);
    }

    newGame() {
        if (!this.loadingGame) {
            this.loadingGame = true;
            this.currentGameName = this.gameName;
            this.store.dispatch(GameActions.start({ gameCategory: GameCategoryType.BoardGame, game: this.game }));
            const newGameInstanceKey = this.boardGamesStateRef.child(this.game.name).child('instances').push().key;
            this.currentGameKey = newGameInstanceKey;
            this.updateInstances();
            this.updateRefs();
            this.setupNewGameInFirebase();
            this.updatePieceSetups();
            this.setupGameWidgets();
            this.instancesPanel.open();
        }
        // throttle by 1000ms
        setTimeout(() => this.loadingGame = false, 1000);
    }

    updateRefs() {
        this.firebaseGamePath = `${this.game.name}/instances/${this.currentGameKey}`;
        this.boardGamesStateRef.child('currentGame').set(this.game.name);
        this.boardGamesStateRef.child('currentPath').set(this.firebaseGamePath);
        this.boardGamesStateRef.child(this.game.name).child('currentGameId').set(this.currentGameKey);
        this.currentGameInstanceRef = this.angularCommunicator.getFirebaseRef(`games/boardGames/${this.firebaseGamePath}`);
        this.currentGameInstanceRef.child('modified').on('value', snap => {
            setTimeout(() => {
                if (this.currentInstance) {
                    this.currentInstance.modified = snap.val();

                    this.instances.sort((a, b) => a.modified <  b.modified ? 1 : -1);
                }
            });
        });
    }

    setupNewGameInFirebase() {
        this.currentGameInstanceRef.child('name').set('untitled');
        if (this.game.board.imageSrc) {
            this.currentGameInstanceRef.child('gameBoardImgSrc').set(this.game.board.imageSrc);
        }
        if (this.game.startRegion) {
            this.currentGameInstanceRef.child('startRegion').set(this.game.startRegion);
        }
        this.updateInstances();
        this.currentGameInstanceRef.child('modified').set(new Date().getTime());
    }

    updatePieceSetups() {
        this.currentGameInstanceRef.child('pieces').on('value', snap => {
            const pieceTypeCounts = {};
            const pieces = snap.val();
            for (const key in pieces) {
                if (key) {
                    const piece = pieces[key];
                    const name = piece.name;
                    if (pieceTypeCounts[name]) {
                        pieceTypeCounts[name]++;
                    } else {
                        pieceTypeCounts[name] = 1;
                    }
                }
            }
            this.currentPieceSetups.forEach(setup => {
                const setupName = setup.type.name;
                setup.usedCount = pieceTypeCounts[setupName] ? pieceTypeCounts[setupName] : 0;
            });
        });
    }

    paramChanged(value, param, index) {
        if (this.changeTimer) {
            clearTimeout(this.changeTimer);
        }
        this.changeTimer = setTimeout(() => {
            this.widget.params[param] = value;
            this.changeTimer = null;
            this.widgetRef.update(this.widget);
        },                            200);
    }
}
