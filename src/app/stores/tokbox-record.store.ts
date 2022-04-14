export function tokboxRecord(state: any = {}, action: any) {
    if (!action) {
        return;
    }
    const type = action.type;
    switch (type) {
            case 'TOKBOX_RECORD_TOGGLE':
            case 'TOKBOX_SCREENSHARE_TOGGLE':
            case 'TOKBOX_RECORDING_SALVAGE':
            case 'TOKBOX_SCREENSHARE_UPDATE':
                return action;
            default:
                return state;
    }
}
