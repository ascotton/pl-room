import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PLVendorGameService, PLGameDbAPI } from '../pl-vendor-game.service';
import { GametableBlokdConfigInterface } from './gametable-config.interface';
import { PLVendorGames } from '../pl-vendor-game-definitions.service';
import { Participant } from '@room/session/store';

// General game rail form requirements:
// * start game - save shared game state with chosen form data
// * end game - remove shared game state
// * refresh form data (in case participants list has changed)
// * get game config - from form data to start game
@Component({
    selector: 'pl-gametable-blokd-drawer',
    templateUrl: './pl-gametable-blokd-drawer.component.html',
    styleUrls: ['./pl-gametable-blokd-drawer.component.less'],
})
export class PLGametableBlokdDrawerComponent implements OnInit, OnDestroy {
    @Input() activity: any;

    initialized = false;
    destroyed$ = new Subject<boolean>();

    user: any;
    participants: Participant[];
    formData: any;
    gameState: any;

    gameApi: PLGameDbAPI;
    settingsApi: PLGameDbAPI;

    sectionVisible: any = {
        players: true,
        options: true,
    };

    aiOpt = { label: 'Computer', value: 'GAMETABLE-AI' };

    constructor(
        private vendorGameService: PLVendorGameService,
    ) { }

    ngOnInit() {
        // setup form
        this.formData = PLVendorGames.blokd.newFormData();

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
            const num = this.formData.model.numPlayers;
            for (let i = 1; i <= num; i++) {
                const p = this.formData.model[`player${i}`];
                if (!p) {
                    gameConfig[`player${i}`] = { clientId: `P-${Math.floor((Math.random() * 1000) + 1)}` };
                }
            }
        }
        this.gameApi.set(gameConfig);
        this.gameApi.get(
            (game: any) => {
                this.gameState = game;
                console.log('--- Rail: new game OK', { gameConfig, STATE: this });
            },
            (err: any) => {
                console.error('--- Rail: new game ERR', err);
            },
        );

    }

    onClickEndGame() {
        this.gameApi.set(null);
        this.refreshPlayerOpts();
        this.gameState = null;
    }

    onClickRefreshPlayers() {
        this.refreshPlayerOpts();
    }

    onClickSection(sectionName) {
        $(`.section-body.${sectionName}`).slideToggle();
        this.sectionVisible[sectionName] = !this.sectionVisible[sectionName];
    }

    onChangeNumPlayers() {
        const model = this.formData.model;
        if (model.numPlayers < 4) {
            model.player4 = null;
        }
        if (model.numPlayers < 3) {
            model.player3 = null;
        }
    }

    onChangePlayer(playerNum) {
        const model = this.formData.model;
        const player = model[`player${playerNum}`];
        const players = [1, 2, 3, 4];
        players.forEach((num: number) => {
            if (num === playerNum) return;
            const otherPlayer = model[`player${num}`];
            if (otherPlayer === player && otherPlayer !== this.aiOpt.value) {
                model[`player${num}`] = null;
            }
        });
    }

    onChangeMute() {
        this.settingsApi.set({
            mute: this.formData.model.mute,
        });
    }

    canStartNewGame() {
        if (this.isNewGameOverride() && !this.gameState) return true;
        const model = this.formData.model;
        const numPlayers = model.numPlayers;
        for (let i = 1; i <= numPlayers; i++) {
            if (!model[`player${i}`]) {
                return false;
            }
        }

        return !this.gameState;
    }

    isNewGameOverride() {
        return localStorage.getItem(NEW_GAME_OVERRIDE);
    }

    canEndGame() {
        return !!this.gameState;
    }

    // ==========================
    // Private
    // ==========================
    private refreshPlayerOpts() {
        // update player opts and clear out stale model values
        const playerOpts = this.vendorGameService.getPlayerOpts(this.participants);
        // Only player one won't have the option for Gametable AI
        this.formData.playerOneOpts = [...playerOpts];
        this.formData.playerOpts = [...playerOpts, this.aiOpt];
        const refreshedPlayers = this.formData.playerOpts.map(({ value }) => value);
        const nums = [1, 2, 3, 4];
        nums.forEach((num: any) => {
            const p = this.formData.model[`player${num}`];
            if (!refreshedPlayers.includes(p)) {
                this.formData.model[`player${num}`] = null;
            }
        });
        console.log('--- refreshPlayersOpts', { STATE: this });
    }

    private setPlayersFromSavedGame(gameData: GametableBlokdConfigInterface) {
        this.gameState = gameData;
        if (!gameData) return;

        this.formData.model.numPlayers = gameData.numPlayers;
        const nums = [1, 2, 3, 4];
        nums.forEach((num: any) => {
            const player = gameData[`player${num}`];
            if (player) {
                const P = this.participants.find(p => p.id === player.clientId);
                if (P) {
                    this.formData.model[`player${num}`] = P.id;
                }
            }
        });
    }

    private checkSavedGame(doneInit?: Function) {
        this.gameApi.get(
            (game: any) => {
                console.log('--- Rail: load game OK', game);
                this.setPlayersFromSavedGame(game);
                doneInit && doneInit();
            },
            (err: any) => { console.error('--- Rail: load game ERR', err); },
        );
    }

    private checkSavedSettings() {
        this.settingsApi.get(
            (settings: any) => {
                console.log('--- Rail: load settings OK', settings);
                this.formData.model.mute = !!(settings && settings.mute);
            },
            (err: any) => { console.error('--- Rail: load settings ERR', err); },
        );
    }

    private getGameConfig(): GametableBlokdConfigInterface {
        return {
            gameId: Date.now(),
            skinId: this.formData.model.boardTheme,
            numPlayers: this.formData.model.numPlayers,
            player1: { clientId: this.formData.model.player1 },
            player2: { clientId: this.formData.model.player2 },
            player3: { clientId: this.formData.model.player3 },
            player4: { clientId: this.formData.model.player4 },
        };
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.vendorGameService.destroyGameDb();
    }

}

const NEW_GAME_OVERRIDE = 'DEV_RVG_NEW_GAME_OVERRIDE';
