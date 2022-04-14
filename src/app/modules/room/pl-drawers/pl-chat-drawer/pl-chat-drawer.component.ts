import { Subscription, Observable } from 'rxjs';
import {
    Component,
    OnInit,
    OnDestroy,
    ViewEncapsulation,
    AfterViewInit,
    ViewChildren,
    QueryList,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { AppModel } from '@common/models/app-model.service';
import { User } from '@modules/user/user.model';
import { selectCurrentUser } from '@modules/user/store';
import { DrawerState, selectDrawer } from '../store';
import { selectGroupedMessages, ChatMessageGroup, selectIsMuted } from './store';
import { PLChatDrawerService } from './pl-chat-drawer.service';
import { flatMap, take, distinctUntilChanged, map } from 'rxjs/operators';
@Component({
    selector: 'pl-chat-drawer',
    templateUrl: 'pl-chat-drawer.component.html',
    styleUrls: ['pl-chat-drawer.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLChatDrawerComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('messagesContainer') messagesContainerEl: ElementRef<HTMLElement>;
    @ViewChildren('message') messagesEl: QueryList<HTMLElement>;
    private subscriptions: Subscription[] = [];

    private user$: Observable<User>;

    private drawer: DrawerState;
    private messages: ChatMessageGroup[] = [];
    public isChatMuted: boolean;
    public user: User;

    public newMessage = '';

    get preventStudentType() {
        const { groups = [] } = this.user;
        return groups.includes('student') && this.isChatMuted;
    }

    get groupedMessages() {
        return this.messages;
    }

    get isDrawerOpen() {
        return this.drawer.open && this.drawer.activeName === 'chat';
    }

    constructor(
        private appModel: AppModel,
        private store: Store<AppState>,
        private chatService: PLChatDrawerService,
        private cd: ChangeDetectorRef,
    ) {
        this.user$ = this.store.select(selectCurrentUser);
    }

    ngOnInit() {
        this.subscriptions.push(
            this.store.select(selectDrawer).subscribe((drawer) => {
                this.drawer = drawer;
            }),
        );

        this.subscriptions.push(
            this.user$.subscribe((user) => {
                this.user = user;
            }),
        );

        this.subscriptions.push(
            this.store.select(selectGroupedMessages).subscribe((messages) => {
                this.messages = messages;
                this.sendChatInteraction();
                this.cd.detectChanges();
            }),
        );

        this.subscriptions.push(
            this.store.select(selectIsMuted).subscribe((isChatMuted) => {
                this.isChatMuted = isChatMuted;
                this.cd.detectChanges();
            }),
        );

        // workaround for @ngrx/effects
        this.chatService.setupEffects();
    }

    ngAfterViewInit() {
        this.subscriptions.push(
            this.messagesEl.changes.pipe(
                map(list => list.length),
                distinctUntilChanged(),
            ).subscribe(() => {
                const containerEl = this.messagesContainerEl.nativeElement;
                containerEl.scrollTo({
                    behavior: 'smooth',
                    top: containerEl.scrollHeight,
                });
            }),
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => {
            s.unsubscribe();
        });

        // workaround for @ngrx/effects
        this.chatService.clearEffects();
    }

    onModelChange() {
        this.cd.detectChanges();
    }

    sendChatInteraction() {
        this.appModel.resetChatTimeout();
    }

    sendMessage(ev: KeyboardEvent) {
        ev.preventDefault();

        this.sendChatInteraction();

        this.newMessage = this.newMessage.trim();

        if (!this.newMessage) {
            return;
        }

        // TODO: Change this when effects work
        // TODO: Implement some feedback logic
        this.user$.pipe(
            take(1),
            flatMap((user) => {
                const message = {
                    message: this.newMessage,
                    userUuid: user.uuid,
                    userName: user.display_name,
                };

                return this.chatService.sendMessage(message);
            }),
        ).subscribe();

        this.newMessage = '';
    }

    setChatMuted(value: boolean) {
        // TODO: Change this when effects work
        // TODO: Implement some feedback logic
        this.chatService.setIsMuted(value).subscribe();
    }

    clearMessages() {
        // TODO: Change this when effects work
        // TODO: Implement some feedback logic
        this.chatService.clearMessages().subscribe();
    }
}
