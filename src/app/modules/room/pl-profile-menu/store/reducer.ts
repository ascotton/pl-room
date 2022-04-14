import { createReducer, on } from '@ngrx/store';
import { ProfileMenuState } from './model';
import { ProfileMenuActions } from './actions';

const initialState: ProfileMenuState = {
    show: false,
};

export const reducer = createReducer(
    initialState,
    on(ProfileMenuActions.toggleDisplay, (state) => {
        return {
            show: !state.show,
        };
    }),
);
