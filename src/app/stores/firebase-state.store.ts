export function firebaseStateStore(state: any = {}, action: any) {
    if (!action) {
        return;
    }
    const type = action.type;
    switch (type) {
            case 'FIREBASE_UPDATE':
                return action;
            case 'FIREBASE_CONNECTION':
                return action;
            default:
                return state;
    }
};
