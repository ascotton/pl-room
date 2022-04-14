export function personas(state: any = {}, action: any) {
    const type = action.type;
    const payload = action.payload;
    switch (type) {
            case 'UPDATE_PERSONAS':
                return payload;
            default:
                return state;
    }
}
