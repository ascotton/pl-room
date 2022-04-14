import { Component,
    Input,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import { PLVendorGameService, PLGameDbAPI } from './pl-vendor-game.service';
import { PLVendorGamesByActivity } from './pl-vendor-game-definitions.service';
import { Participant, ParticipantType } from '@room/session/store';
import { Subscription } from 'rxjs';

const PL_GAME_DB = 'PLGameDb';
@Component({
    selector: 'pl-vendor-game',
    templateUrl: './pl-vendor-game.component.html',
    styleUrls: ['./pl-vendor-game.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PLVendorGameComponent implements OnInit, OnDestroy {

    @Input() activity: any;

    initialized = false;
    gameConfig: any;
    iframeSrc: string;
    checkChangesTimeout: any;
    participants: Participant[];
    showTrioExample: boolean;
    showTrioInstruction: boolean;
    settingsApi: PLGameDbAPI;

    private subscriptions: Subscription[] = [];

    constructor(
        public vendorGameService: PLVendorGameService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.vendorGameService.setupPLGameDb(this.activity);
        this.subscriptions.push(this.subscribeToUsers());
        this.initTrioExampleInstruction();
        this.watchTrioRefs();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => {
            if (sub) { sub.unsubscribe(); }
        });
        this.vendorGameService.destroyGameDb();
        clearTimeout(this.checkChangesTimeout);
    }

    private initTrioExampleInstruction(): void {
        const windowPLGameDb = window[PL_GAME_DB];
        this.settingsApi = windowPLGameDb.ref('settings');
        this.showTrioInstruction = false;
        this.showTrioExample = false;
        this.settingsApi.set({
            showExample: this.showTrioExample,
            showInstruction: this.showTrioInstruction,
        });
    }

    private watchTrioRefs(): void {
        const windowPLGameDb = window[PL_GAME_DB];
        this.settingsApi = windowPLGameDb.ref('settings');
        this.settingsApi.onValue((trioGameValues: any) => {
            const { showExample, showInstruction } = trioGameValues;
            this.showTrioInstruction = showInstruction;
            this.showTrioExample = showExample;
            this.cdr.detectChanges();
        });
    }

    private subscribeToUsers(): Subscription {
        return this.vendorGameService.getParticipantsAndLocalId()
            .subscribe(([participants, localId]) => {
                this.participants = participants;

                // setup iframe once and only once
                if (!this.initialized) {
                    let url: string;
                    const done = () => {
                        this.iframeSrc = this.vendorGameService.sanitizeUrl(url);
                        const windowPLGameDb = window[PL_GAME_DB];
                        console.log(
                            '--- Vendor game: Checking state before rendering iframe',
                            { STATE: this, iframeSrc: url, hasPLGameDb: !!windowPLGameDb },
                        );
                        if (windowPLGameDb) {
                            this.initialized = true;
                            console.log('--- Vendor Game: iframe initialized...', { STATE: this, iframeSrc: url });
                        } else {
                            console.error('--- Vendor Game: Shared PLGameDb was not initialized', { STATE: this });
                        }
                    };

                    const plGameDb = window[PL_GAME_DB];
                    console.log(
                        '--- Vendor Game: Checking for shared PLGameDb object...',
                        { STATE: this, PLGameDb: plGameDb },
                    );

                    if (plGameDb) {
                        const game = PLVendorGamesByActivity[this.activity.type];
                        const localParticipant = this.participants.find(p => p.id === localId);
                        const isRoomOwner = localParticipant.type === ParticipantType.host ? 1 : 0;
                        url = game.getIframeUrl({ isRoomOwner, clientId: localParticipant.id });
                        done();
                    } else {
                        console.error('--- Vendor Game: Shared PLGameDb was not initialized', { STATE: this });
                    }
                }
            });
    }
}
