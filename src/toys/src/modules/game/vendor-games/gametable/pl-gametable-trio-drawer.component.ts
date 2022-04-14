import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Participant } from '@room/session/store';
import { PLVendorGameService, PLGameDbAPI } from '../pl-vendor-game.service';
import { GametableTrioConfigInterface } from './gametable-config.interface';
import { PLVendorGames } from '../pl-vendor-game-definitions.service';

// General game rail form requirements:
// * start game - save shared game state with chosen form data
// * end game - remove shared game state
// * refresh form data (in case personas list has changed)
// * get game config - from form data to start game
@Component({
    selector: 'pl-gametable-trio-drawer',
    templateUrl: './pl-gametable-trio-drawer.component.html',
    styleUrls: ['./pl-gametable-trio-drawer.component.less'],
})

export class PLGametableTrioDrawerComponent implements OnInit, OnDestroy {
    @Input() activity: any;

    initialized = false;
    destroyed$ = new Subject<boolean>();

    participants: Participant[];
    formData: any;
    isGameActive: boolean;

    gameApi: PLGameDbAPI;
    settingsApi: PLGameDbAPI;

    sectionVisible: any = {
        players: true,
        options: true,
    };

    enableStartGameBtn$ = new BehaviorSubject(false);
    enableEndGameBtn$ = new BehaviorSubject(false);
    showExample: boolean;
    showInstruction: boolean;

    private subscriptions: Subscription[] = [];

    constructor(
        private vendorGameService: PLVendorGameService
    ) {}

    ngOnInit() {
        // setup form
        this.formData = PLVendorGames.trio.newFormData();
        this.initInstructionExample();
        this.subscriptions.push(this.subscribeToGetPersonasAndUser())
        this.watchTrioRefs();
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.vendorGameService.destroyGameDb();
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    onClickStartNewGame() {
        const gameConfig = this.getGameConfig();
        this.gameApi.set(gameConfig);
        this.gameApi.get(
            (game: any) => {
                this.isGameActive = game;
                this.updateEndGameBtn();
            },
            (err: any) => {
                console.error('--- Rail: new game ERR', err);
            },
        );
    }
    onClickEndGame() {
        this.gameApi.set(null);
        this.refreshPlayerOpts();
        this.isGameActive = null;
        this.updateEndGameBtn();
    }

    onClickRefreshPlayers() {
        this.refreshPlayerOpts();
    }

    onClickSection(sectionName) {
        $(`.section-body.${sectionName}`).slideToggle();
        this.sectionVisible[sectionName] = !this.sectionVisible[sectionName];
    }

    onChangeNumPlayers() {
        const { model } = this.formData;

        model.players.forEach((player) => {
            if (player.position > model.numPlayers) {
                player.value = null;
            }
        });
        this.checkGameActiveStatus();
    }

    onChangePlayerCheck(playerNum, playerValue) {
        const { model } = this.formData;

        model.players.forEach((player) => {
            if ((player.position !== playerNum) && (player.value === playerValue)) {
                player.value = null;
            }
        });

        this.checkGameActiveStatus();
    }

    onChangeMute() {
        this.settingsApi.set({
            mute: this.formData.model.mute,
        });
    }

    checkGameActiveStatus(): void {
        const { model } = this.formData;
        const { numPlayers } = model;

        const currentPlayers = model.players.filter((player) => {
            if (player.value) {
                return player
            }
        });
        this.isGameActive = currentPlayers.length === numPlayers;
        this.updateStartGameBtn();
    }

    updateStartGameBtn(status?:boolean): void {
        if (status) {
            this.enableStartGameBtn$.next(status);
        } else {
            this.enableStartGameBtn$.next(this.isGameActive);
        }
    }

    updateEndGameBtn(): void {
        this.enableEndGameBtn$.next(!!this.isGameActive);
    }

    toggleExample(): void {
        this.showExample = !this.showExample;
        this.settingsApi.set({
            showExample: this.showExample,
            showInstruction: this.showInstruction
        });
    }

    toggleInstruction(): void {
        this.showInstruction = !this.showInstruction;
        this.settingsApi.set({
            showExample: this.showExample,
            showInstruction: this.showInstruction
        });
    }

    // ==========================
    // Private
    // ==========================

    private subscribeToGetPersonasAndUser(): Subscription {
        // get connected participants
        return this.vendorGameService.getParticipantsAndLocalId()
        .pipe(takeUntil(this.destroyed$))
        .subscribe(([participants, localId]) => {
            this.participants = participants;
            if (!this.initialized) {
                this.refreshPlayerOpts();
            }

            // check for an existing game
            const gameDb = this.vendorGameService.setupPLGameDb(this.activity);
            this.gameApi = gameDb.ref('rules');
            this.settingsApi = gameDb.ref('settings');
            this.checkSavedGame(() => {
                this.initialized = true;
            });
            this.checkSavedSettings();
        });
    }

    private initInstructionExample(): void {
        this.showInstruction = false;
        this.showExample = false;
        this.settingsApi = this.vendorGameService.setupPLGameDb(this.activity).ref('settings');
        this.settingsApi.set({
            showExample: this.showExample,
            showInstruction: this.showInstruction
        });
    }

    private watchTrioRefs(): void {
        this.settingsApi.onValue((trioGameValues: any) => {
            const { showExample, showInstruction } = trioGameValues;
            this.showInstruction = showInstruction;
            this.showExample = showExample;
        })
    }

    private refreshPlayerOpts() {
        // update player opts and clear out stale model values
        const playerOpts = this.vendorGameService.getPlayerOpts(this.participants);
        // Only player one won't have the option for Gametable AI
        let { model, playerOneOpts } = this.formData;
        playerOneOpts = [...playerOpts];
        this.formData.playerOpts = [...playerOpts];
        const refreshedPlayers = this.formData.playerOpts.map(({ value }) => value);
        model.players = model.players.map((player) => {
            if (!refreshedPlayers.includes(player.value)) {
                player.value = null;
            }
            return player;
        });
    }

    private setPlayersFromSavedGame(gameData: GametableTrioConfigInterface) {
        this.isGameActive = !!gameData;
        if (!gameData) return;

        const { model } = this.formData;

        model.numPlayers = gameData.numPlayers;
        const nums = [1, 2, 3, 4];
        nums.forEach((num: any) => {
            const player = gameData[`player${num}`];
            if (player) {
                const P = this.participants.find(p => p.id === player.clientId);
                if (P) {
                    model.players[num-1].value = P.id;
                }
            }
        });
        this.updateStartGameBtn();
        this.updateEndGameBtn();
    }

    private checkSavedGame(doneInit?: Function) {
        this.gameApi.get(
            (game: any) => {
                this.setPlayersFromSavedGame(game);
                doneInit && doneInit();
            },
            (err: any) => { console.error('--- Rail: load game ERR', err); },
        );
    }

    private checkSavedSettings() {
        this.settingsApi.get(
            (settings: any) => {
                this.formData.model.mute = !!(settings && settings.mute);
            },
            (err: any) => { console.error('--- Rail: load settings ERR', err); },
        );
    }

    private getGameConfig(): GametableTrioConfigInterface {
        const { model } = this.formData;
        const { players } = model;
        const gameData = {
            gameId: Date.now(),
            skinId: model.boardTheme,
            numPlayers: model.numPlayers,
            player1: { clientId: model.player1 },
            player2: { clientId: model.player2 },
            player3: { clientId: model.player3 },
            player4: { clientId: model.player4 },
        };

        players.forEach((player) => {
            let key = `player${player.position}`;
            gameData[key] = { clientId: player.value }
        });

        return gameData;
    }
}
