import { createAction } from '@ngrx/store';

const toggleDisplay = createAction('/profileMenu/toggleDisplay');

export const ProfileMenuActions = {
    toggleDisplay,
};
