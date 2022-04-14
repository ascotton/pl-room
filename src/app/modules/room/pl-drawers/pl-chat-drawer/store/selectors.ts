import { AppState } from '@app/store';
import { createSelector } from '@ngrx/store';
import { ChatMessageGroup } from './state';

export const selectChat = (state: AppState) => state.chat;

export const selectIsMuted = createSelector(selectChat, chat => chat.isMuted);

export const selectUnreadCount = createSelector(selectChat, chat => chat.unreadCount);

export const selectMessages = createSelector(selectChat, chat => chat.messages);

export const selectGroupedMessages = createSelector(selectMessages, (messages) => {
    if (!messages.length) {
        return [];
    }

    const firstMessage = messages[0];

    const groupedMessages: ChatMessageGroup[] = [{
        ...firstMessage,
        messages: [firstMessage],
    }];

    let currGroupIndex = 0;

    messages.forEach((msg, i) => {
        if (!i) {
            return;
        }

        const { userUuid } = msg;
        const currGroup = groupedMessages[currGroupIndex];

        const isSameGroup = currGroup.userUuid === userUuid;

        if (isSameGroup) {
            groupedMessages[currGroupIndex] = {
                ...msg,
                messages: [...currGroup.messages, msg],
            };
        } else {
            groupedMessages.push({
                ...msg,
                messages: [msg],
            });
            currGroupIndex++;
        }
    });

    return groupedMessages;
});
