import { AppState } from '@app/store';
import { createSelector, select } from '@ngrx/store';
import { pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export const selectFirebase = (state: AppState) => state.firebase;

export const selectFirebaseStatus = createSelector(
    selectFirebase,
    state => state.status,
);

export const selectIsFirebaseInitialized = createSelector(
    selectFirebaseStatus,
    status => status === 'initialized',
);

export const selectFirebaseReady = pipe(
    select(selectFirebaseStatus),
    filter(status => status === 'initialized'),
);

export const selectIsFirebaseConnected = createSelector(
    selectFirebase,
    fbState => fbState.isConnected,
);
