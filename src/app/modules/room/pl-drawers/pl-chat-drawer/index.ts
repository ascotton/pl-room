import { NgModule } from '@angular/core';
import { PLChatDrawerComponent } from './pl-chat-drawer.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/reducer';
import { PLChatDrawerService } from './pl-chat-drawer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PLPermissionsModule } from '@app/common/auth';
import { PLIconModule } from '@root/index';
import { PLCommonPipesModule } from '@common/pipes';
import { PLChatMessageComponent } from './pl-chat-message/pl-chat-message.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PLCommonPipesModule,
        PLPermissionsModule,
        PLIconModule,
        StoreModule.forFeature('chat', reducer),
        // TODO: Change this when effect work with the commented code
        /* EffectsModule.forFeature([
            ChatEffects,
        ]), */
    ],
    exports: [PLChatDrawerComponent],
    declarations: [PLChatDrawerComponent, PLChatMessageComponent],
    providers: [PLChatDrawerService],
})
export class PLChatDrawerModule { }
