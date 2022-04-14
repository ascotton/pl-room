import { Injectable } from '@angular/core';
import { FirebaseModel } from '@common/models/firebase/FirebaseModel';
import { Observable, Subscription } from 'rxjs';
import { map, filter, take, mergeMap } from 'rxjs/operators';
import { FirebaseRef, FirebaseRefEventType } from '@common/firebase/firebase-ref';
import { ChatMessage, ChatActions } from './store';

import { Store } from '@ngrx/store';
import { AppState } from '@root/src/app/store';
import { selectDrawer, DrawerState } from '../store';

@Injectable()
export class PLChatDrawerService {
    private subscriptions: Subscription[] = [];

    private chatRef: FirebaseRef;
    private appRef: FirebaseRef;
    readonly messages$: Observable<ChatMessage[]>;
    readonly messageAdded$: Observable<ChatMessage>;
    readonly isMuted$: Observable<boolean>;

    constructor(
        firebaseModel: FirebaseModel,
        // workaround for @ngrx/effects
        private store: Store<AppState>,
    ) {
        this.chatRef = new FirebaseRef(firebaseModel.getFirebaseRef('chat'));
        this.appRef = new FirebaseRef(firebaseModel.getFirebaseRef('app'));

        this.messages$ = this.onMessages('value').pipe(
            map(snap => snap.val()),
            map(val =>
                val ? Object.keys(val)
                    .map<ChatMessage>((key) => {
                        return {
                            id: key,
                            ...val[key],
                        };
                    })
                    // Hacky fix to not show previous implementation messages
                    .filter(message => typeof message.time === 'number')
            : []),
        );

        this.messageAdded$ = this.onMessages('child_added').pipe(
            map(snap => ({
                ...snap.val(),
                id: snap.key,
            })),
        );

        this.isMuted$ = this.appRef.valueChanges.pipe(
            map(snap => snap.val()),
            filter(val => Boolean(val)),
            map(val => val.chatIsMuted),
        );
    }

    private onMessages(event: FirebaseRefEventType) {
        return this.chatRef.on(
            event,
            ref => ref.orderByChild('time').startAt(Date.now()),
        );
    }

    private isDrawerOpen(drawer: DrawerState) {
        return drawer.open && drawer.activeName === 'chat';
    }

    // workaround for @ngrx/effects
    setupEffects() {
        this.subscriptions.push(
            this.messages$.subscribe((messages) => {
                this.store.dispatch(ChatActions.setMessages({ messages }));
            }),
        );

        this.subscriptions.push(
            this.store.select(selectDrawer).subscribe((drawer) => {
                if (this.isDrawerOpen(drawer)) {
                    this.store.dispatch(ChatActions.resetUnreadCount());
                }
            }),
        );

        this.subscriptions.push(
            this.isMuted$.subscribe((isMuted) => {
                this.store.dispatch(ChatActions.setIsMuted({ isMuted }));
            }),
        );

        this.subscriptions.push(
            this.messageAdded$.pipe(
                mergeMap(() => this.store.select(selectDrawer).pipe(take(1))),
            ).subscribe((drawer) => {
                if (this.isDrawerOpen(drawer)) {
                    return;
                }
                this.store.dispatch(ChatActions.incrementUnreadCount());
            }),
        );
    }

    // workaround for @ngrx/effects
    clearEffects() {
        this.subscriptions.forEach((s) => {
            s.unsubscribe();
        });
    }

    sendMessage(message: Omit<ChatMessage, 'time'>) {
        return this.chatRef.push({
            ...message,
            time: firebase.database.ServerValue.TIMESTAMP,
        });
    }

    setIsMuted(newValue: boolean) {
        return this.appRef.update({
            chatIsMuted: newValue,
        });
    }

    clearMessages() {
        return this.chatRef.remove();
    }
}
