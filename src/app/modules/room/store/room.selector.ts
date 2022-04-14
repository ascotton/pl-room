import { AppState } from '@app/store';
import { createSelector, select } from '@ngrx/store';
import { selectCurrentUser } from '@modules/user/store';
import { selectFirebase } from '@common/firebase/store';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

export const selectRoom = (state: AppState) => state.room;

export const selectIsRoomReady = pipe(
    select(
        createSelector(
            selectCurrentUser,
            selectRoom,
            selectFirebase,
            (user, room, fbState) =>
                user.groups &&
                room.status === 'success' &&
                fbState.status === 'initialized',
        ),
    ),
    filter(Boolean),
);
