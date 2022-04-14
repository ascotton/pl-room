import './guess-who';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    PLButtonModule,
    PLCarouselModule,
    PLIconModule,
    PLInputModule,
} from '@root/index';

import { PLImageDecksModule } from '../../../../app/modules/room/pl-image-decks';

import { PLCardGameComponent } from "./pl-card-game/pl-card-game.component";
import { PLGameComponent } from "./pl-game.component";
import { PLGameDrawerComponent } from "./pl-game-drawer.component";
import { PLGoFishDrawerComponent } from "./go-fish/pl-go-fish-drawer.component";
import { PLGoFishComponent } from "./go-fish/pl-go-fish.component";

import { PLScenesModule } from './pl-scenes';
import { PLVendorGamesModule} from './vendor-games'

@NgModule({
    imports: [
        CommonModule,
        PLButtonModule,
        PLCarouselModule,
        PLIconModule,
        PLInputModule,
        PLImageDecksModule,
        PLScenesModule,
        PLVendorGamesModule,
    ],
    exports: [
        PLCardGameComponent,
        PLGameComponent,
        PLGameDrawerComponent,
        PLGoFishComponent,
        PLGoFishDrawerComponent,
    ],
    declarations: [
        PLCardGameComponent,
        PLGameComponent,
        PLGameDrawerComponent,
        PLGoFishComponent,
        PLGoFishDrawerComponent,
    ],
    providers: [],
})
export class PLGameModule {}

export { PLGameComponent } from "./pl-game.component";
export { PLGameDrawerComponent } from "./pl-game-drawer.component";

