export function gameGoFish(state: any = {}, action: any) {
        const type = action.type;
        const payload = action.payload;
        switch (type) {
            case 'UPDATE_GAME_GO_FISH':
                return payload;
        default:
            return state;
    }
};
