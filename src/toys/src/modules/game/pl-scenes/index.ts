import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { PLButtonModule, PLInputModule, PLIconModule,
} from '@root/index';

import { PLScenesComponent } from './pl-scenes.component';
import { PLScenesDrawerComponent } from './pl-scenes-drawer.component';
import { PLScenesFactoryService } from './pl-scenes-factory.service';
import { StickerSelectButtonComponent } from './sticker-select-button.component';


@NgModule({
    imports: [
        CommonModule,
        DragDropModule,
        PLButtonModule,
        PLInputModule,
        PLIconModule,
    ],
    exports: [ PLScenesComponent, PLScenesDrawerComponent, StickerSelectButtonComponent,],
    declarations: [ PLScenesComponent, PLScenesDrawerComponent, StickerSelectButtonComponent,],
    providers: [ PLScenesFactoryService ],
})
export class PLScenesModule {}

export { PLScenesComponent } from './pl-scenes.component';
export { PLScenesDrawerComponent } from './pl-scenes-drawer.component';
export { StickerSelectButtonComponent } from './sticker-select-button.component';
