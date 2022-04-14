import { createAction, props } from '@ngrx/store';
import { ChatMessage } from './state';

export interface ChatAddMessagePayload {
    message: ChatMessage;
}

export interface ChatSetMessagesPayload {
    messages: ChatMessage[];
}

export interface ChatSetIsMutedPayload {
    isMuted: boolean;
}

const init = createAction('/chat/init');
const addMessage = createAction('/chat/addMessage', props<ChatAddMessagePayload>());
const setMessages = createAction('/chat/setMessages', props<ChatSetMessagesPayload>());
const incrementUnreadCount = createAction('/chat/incrementUnreadCount');
const resetUnreadCount = createAction('/chat/resetUnreadCount');
const setIsMuted = createAction('/chat/setIsMuted', props<ChatSetIsMutedPayload>());

export const ChatActions = {
    init,
    setMessages,
    addMessage,
    incrementUnreadCount,
    resetUnreadCount,
    setIsMuted,
};
