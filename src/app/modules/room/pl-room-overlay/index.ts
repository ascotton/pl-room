import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLRoomOverlayComponent } from './pl-room-overlay.component';
import { PLRoomOverlayService } from './pl-room-overlay.service';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        PLRoomOverlayComponent,
    ],
    providers: [
        PLRoomOverlayService,
    ],
})
export class PLRoomOverlayModule { }

export {
    PLRoomOverlayComponent,
};
