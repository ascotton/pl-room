import { createReducer, on } from '@ngrx/store';
import { initialState } from './state';
import { ChatActions } from './actions';

export const reducer = createReducer(
    initialState,
    on(ChatActions.setMessages, (state, action) => {
        return {
            ...state,
            messages: [
                ...action.messages,
            ],
        };
    }),
    on(ChatActions.incrementUnreadCount, (state) => {
        return {
            ...state,
            unreadCount: state.unreadCount + 1,
        };
    }),
    on(ChatActions.resetUnreadCount, (state) => {
        return {
            ...state,
            unreadCount: 0,
        };
    }),
    on(ChatActions.setIsMuted, (state, action) => {
        return {
            ...state,
            isMuted: action.isMuted,
        };
    }),
);
