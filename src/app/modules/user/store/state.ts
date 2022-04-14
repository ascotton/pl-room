import { User } from '../user.model';
import { GuidService } from '@common/services/GuidService';

export interface UserState {
    isAuthenticated: boolean;
    userId: string;
    user: User;
    uiFlags: Record<string, boolean>;
}

const uuid = new GuidService().generateUUID();

export const initialState: UserState = {
    isAuthenticated: false,
    userId: uuid,
    user: {
        uuid,
        first_name: 'guest',
        last_name: '',
        display_name: 'guest',
    },
    uiFlags: {},
};
