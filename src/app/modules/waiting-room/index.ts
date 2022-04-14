import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PLIconModule } from '@root/index';
import { PLWaitingRoomComponent } from './waiting-room.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PLIconModule,
        MatSlideToggleModule,
        MatIconModule,
    ],
    exports: [PLWaitingRoomComponent],
    declarations: [PLWaitingRoomComponent],
    providers: [],
})
export class PLWaitingRoomModule { }
