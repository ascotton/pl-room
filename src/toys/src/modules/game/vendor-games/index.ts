import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    PLInputModule,
    PLButtonModule,
    PLIconModule,
    PLDotLoaderModule,
    PLHttpModule,
} from '@root/index';

import { PLVendorGameComponent } from './pl-vendor-game.component';
import { PLVendorGameDrawerComponent } from './pl-vendor-game-drawer.component';
import { PLVendorGameService } from './pl-vendor-game.service';

import { PLGametableCheckersDrawerComponent } from './gametable/pl-gametable-checkers-drawer.component';
import { PLGametableDotsAndBoxesDrawerComponent } from './gametable/pl-gametable-dots-and-boxes-drawer.component';
import { PLGametableBlokdDrawerComponent } from './gametable/pl-gametable-blokd-drawer.component';
import { PLGametableTrioDrawerComponent } from './gametable/pl-gametable-trio-drawer.component';

@NgModule({
    imports: [
        CommonModule,
        PLButtonModule,
        PLDotLoaderModule,
        PLHttpModule,
        PLIconModule,
        PLInputModule,
    ],
    exports: [
        PLVendorGameComponent,
        PLVendorGameDrawerComponent,
        PLGametableCheckersDrawerComponent,
        PLGametableDotsAndBoxesDrawerComponent,
        PLGametableBlokdDrawerComponent,
        PLGametableTrioDrawerComponent
    ],
    declarations: [
        PLVendorGameComponent,
        PLVendorGameDrawerComponent,
        PLGametableCheckersDrawerComponent,
        PLGametableDotsAndBoxesDrawerComponent,
        PLGametableBlokdDrawerComponent,
        PLGametableTrioDrawerComponent
    ],
    providers: [PLVendorGameService],
})
export class PLVendorGamesModule { }

export { PLVendorGameComponent } from './pl-vendor-game.component';
export { PLVendorGameDrawerComponent } from './pl-vendor-game-drawer.component';
export { PLVendorGameService } from './pl-vendor-game.service';
