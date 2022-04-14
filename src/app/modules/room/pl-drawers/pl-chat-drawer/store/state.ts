import moment from 'moment';

export class ChatMessage {
    id?: string;
    message: string;
    time: moment.MomentInput;
    userName: string;
    userUuid: string;
}

export class ChatMessageGroup extends ChatMessage {
    messages: ChatMessage[];
}

export interface ChatState {
    messages: ChatMessage[];
    unreadCount: number;
    isMuted: boolean;
}

export const initialState: ChatState = {
    messages: [],
    unreadCount: 0,
    isMuted: false,
};
