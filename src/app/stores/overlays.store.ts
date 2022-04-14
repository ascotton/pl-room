export function overlaysStore(state: any = {}, action: any) {
    const type = action.type;
    const payload = action.payload;
    switch (type) {
        case 'UPDATE_OVERLAYS':
            return payload;
        default:
            return state;
    }
};
