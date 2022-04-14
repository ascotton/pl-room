import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PLVendorGameService, PLGameDbAPI } from '../pl-vendor-game.service';
import { GametableCheckersConfigInterface } from './gametable-config.interface';
import { PLVendorGames } from '../pl-vendor-game-definitions.service';
import { Participant } from '@room/session/store';


// General game rail form requirements:
// * start game - save shared game state with chosen form data
// * end game - remove shared game state
// * refresh form data (in case participants list has changed)
// * get game config - from form data to start game
@Component({
    selector: 'pl-gametable-checkers-drawer',
    templateUrl: './pl-gametable-checkers-drawer.component.html',
    styleUrls: ['./pl-gametable-checkers-drawer.component.less'],
})
export class PLGametableCheckersDrawerComponent implements OnInit {
    @Input() activity: any;

    initialized = false;
    destroyed$ = new Subject<boolean>();

    participants: Participant[];
    formData: any;
    gameState: any;

    gameApi: PLGameDbAPI;
    settingsApi: PLGameDbAPI;

    sectionVisible: any = {
        players: true,
        options: true,
    }

    constructor(
        private vendorGameService: PLVendorGameService,
    ) { }

    ngOnInit() {
        // setup form
        this.formData = PLVendorGames.checkers.newFormData();

        // get connected participants
        this.vendorGameService.getParticipantsAndLocalId()
        .pipe(takeUntil(this.destroyed$))
        .subscribe(([participants]) => {
            this.participants = participants;
            if (!this.initialized) {
                this.refreshPlayerOpts();
            }

            // check for an existing game
            const gameDb = this.vendorGameService.setupPLGameDb(this.activity);
            this.gameApi = gameDb.ref('rules');
            this.settingsApi = gameDb.ref('settings');

            this.checkSavedGame(() => {
                console.log(`--- Rail: Initialized`, { STATE: this });
                this.initialized = true;
            });
            this.checkSavedSettings();
        });
    }

    onClickStartNewGame() {
        const gameConfig = this.getGameConfig();
        if (this.isNewGameOverride()) {
            const players = ['Top', 'Bottom'];
            players.forEach(p => {
                const PLAYER = this.formData.model[`player${p}`];
                if (!PLAYER) {
                    gameConfig.players[`${p.toLowerCase()}`] = { clientId: `P-${Math.floor((Math.random() * 1000) + 1)}` };
                }
            });
        }
        this.gameApi.set(gameConfig);
        this.gameApi.get(
            (game: any) => {
                this.gameState = game;
                console.log('--- Rail: new game OK', {STATE: this, gameConfig});
            },
            (err: any) => {
                console.error('--- Rail: new game ERR', err);
            }
        )

    }

    onClickEndGame() {
        this.gameApi.set(null);
        this.refreshPlayerOpts();
        this.gameState = null;
    }

    onClickRefreshPlayers() {
        this.refreshPlayerOpts();
        this.checkSavedGame();
    }

    onClickSection(sectionName) {
        $(`.section-body.${sectionName}`).slideToggle();
        this.sectionVisible[sectionName] = !this.sectionVisible[sectionName];
    }

    onChangePlayer(topOrBottom: string) {
        const model = this.formData.model;
        const player = model[`player${topOrBottom}`];
        const players = ['Top', 'Bottom'];
        players.forEach((p: string) => {
            if (p === topOrBottom) return;
            const otherPlayer = model[`player${p}`];
            if (otherPlayer === player) {
                model[`player${p}`] = null;
            }
        })
    }

    onChangeMute() {
        this.settingsApi.set({
            mute: this.formData.model.mute,
        });
    }

    canStartNewGame() {
        if (this.isNewGameOverride() && !this.gameState) return true;
        const model = this.formData.model;
        return !!(model.playerTop && model.playerBottom) && !this.gameState;
    }

    isNewGameOverride() {
        return localStorage.getItem(NEW_GAME_OVERRIDE)
    }

    canEndGame() {
        return !!this.gameState;
    }

    // ==========================
    // Private
    // ==========================
    private refreshPlayerOpts() {
        // update players
        const playerOpts = this.formData.playerOpts = this.vendorGameService.getPlayerOpts(this.participants);
        if (this.formData.topPlayer) {
            if (!playerOpts.find((p: any) => p.value === this.formData.topPlayer)) {
                this.formData.topPlayer = null;
            }
        }
        if (this.formData.bottomPlayer) {
            if (!playerOpts.find((p: any) => p.value === this.formData.bottomPlayer)) {
                this.formData.bottomPlayer = null;
            }
        }
    }

    private setPlayersFromSavedGame(gameData: GametableCheckersConfigInterface) {
        this.gameState = gameData;
        if (!gameData) return;

        const top = this.participants.find(p => p.id === gameData.players.top.clientId);
        const bottom = this.participants.find(p => p.id === gameData.players.bottom.clientId);
        if (top) {
            this.formData.model.playerTop = top.id;
        }
        if (bottom) {
            this.formData.model.playerBottom = bottom.id;
        }
    }

    private checkSavedGame(doneInit?: Function) {
        this.gameApi.get(
            (game: any) => {
                console.log('--- Rail: load game OK', game);
                this.setPlayersFromSavedGame(game);
                doneInit && doneInit();
            },
            (err: any) => { console.error('--- Rail: load game ERR', err) },
        )
    }

    private checkSavedSettings() {
        this.settingsApi.get(
            (settings: any) => {
                console.log('--- Rail: load settings OK', settings);
                this.formData.model.mute = !!(settings && settings.mute);
            },
            (err: any) => { console.error('--- Rail: load settings ERR', err) },
        );
    }

    private getGameConfig(): GametableCheckersConfigInterface {
        return {
            gameId: Date.now(),
            boardSize: this.formData.model.boardSize,
            bottomMovesFirst: this.formData.model.bottomMovesFirst,
            forceJumps: false,
            showMoves: this.formData.model.showMoves,
            skinId: this.formData.model.boardTheme,
            players: {
                top: { clientId: this.formData.model.playerTop },
                bottom: { clientId: this.formData.model.playerBottom }
            }
        };
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.vendorGameService.destroyGameDb();
    }

}

const NEW_GAME_OVERRIDE = 'DEV_RVG_NEW_GAME_OVERRIDE';
