export function tokboxStore(state: any = {}, action: any) {
    const type = action.type;
    const payload = action.payload;
    switch (type) {
        case 'UPDATE_TOKBOX':
            return payload;
        default:
            return state;
    }
}
