import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { PLChatDrawerService } from '../pl-chat-drawer.service';
import { ChatActions } from './actions';
import { exhaustMap, map } from 'rxjs/operators';

// TODO: Integrate and complete this once we fix the problem with
// @ngrx/effects and the upgraded services availability.
@Injectable()
export class ChatEffects {

    @Effect() isMuted$ = this.actions$.pipe(
        ofType(ChatActions.init),
        exhaustMap(() => {
            return this.chatService.isMuted$.pipe(
                map(isChatMuted => ChatActions.setIsMuted({ isMuted: isChatMuted })),
            );
        }),
    );

    @Effect() setMuted$ = this.actions$.pipe(
        ofType(ChatActions.setIsMuted),
        exhaustMap((({ isMuted }) => {
            return this.chatService.setIsMuted(isMuted);
        })),
    );

    constructor(
        private actions$: Actions,
        private chatService: PLChatDrawerService,
    ) { }
}
