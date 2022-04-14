import { Component, ViewChild, OnInit, OnChanges } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@app/store';

import { FirebaseModel } from '@common/models/firebase/FirebaseModel';

import { GameCategoryType } from '@modules/pl-games/store';
import { selectDrawer } from '../store';

import { PLDrawerPanelComponent } from '../pl-drawer-panel/pl-drawer-panel.component';

import { BoardGame, PLBoardGamesFactoryService } from '../../../pl-games/pl-board-games/pl-board-games-factory.service';

@Component({
    selector: 'pl-games-drawer',
    templateUrl: './pl-games-drawer.component.html',
    styleUrls:  ['./pl-games-drawer.component.less'],
})

export class PLGamesDrawerComponent implements OnInit, OnChanges {
    @ViewChild(PLDrawerPanelComponent) linkPanel: PLDrawerPanelComponent;

    active = false;
    gamesRef:  firebase.database.Reference;
    currentGameName: string;
    defaultGameActivity: any;

    boardGamesList: BoardGame[];

    sectionVisible = {
        boardGames: true,
        boardGameControls: false,
    };
    currentGameCategory: GameCategoryType;
    detailView: boolean;
    currentGame: BoardGame;

    constructor(private store: Store<AppState>,
                private firebaseModel: FirebaseModel,
                private boardGamesFactory: PLBoardGamesFactoryService,
    ) {
        this.initBoardGames();
    }

    initBoardGames() {
        const gameNames = [
            'jungle-adventure',
            'space-adventure',
            'arctic-adventure',
        ];
        this.boardGamesList = gameNames.map(gameName => this.boardGamesFactory.getBoardGame(gameName));
    }

    ngOnInit() {

        const subscription = this.store.select(selectDrawer)
            .subscribe((state) => {
                const nextActive = state.open && state.activeName === 'games';
                // if (nextActive &&  !this.active) {
                //     this.store.dispatch(GameActions.open());
                // } else if (!nextActive &&  this.active) {
                //     this.store.dispatch(GameActions.close());
                // }
                this.active = nextActive;
            });

        this.gamesRef = this.firebaseModel.getFirebaseRef('games');
        this.gamesRef.child('boardGames').child('currentGame').once('value', snap => {
            const currentGameName = snap.val();
            if (currentGameName) {
                setTimeout(() => {
                    this.loadBoardGame(this.boardGamesList.find(game => game.name === currentGameName));
                });
            }
        });
    }

    ngOnChanges(event) {
    }

    getGameDrawerClasses() {
        return {
            in: this.active,
            'panel-2-active': this.detailView,
        };
    }

    leaveDetail() {
        this.detailView = false;
        this.gamesRef.child('boardGames').child('splashScreenSrc').set('');
    }

    loadBoardGame(game: BoardGame) {
        this.currentGame = game;
        this.currentGameCategory = GameCategoryType.BoardGame;
        this.detailView = true;
        this.gamesRef.child('boardGamesActive').set(true);
    }
}
