export function teamWriteStore(state: any = {}, action: any) {
    if (!action) {
        return;
    }
    const type = action.type;
    switch (type) {
            case 'ACTIVATE_TEAM_WRITE':
                return action;
            case 'RESET_TEAM_WRITE_DOC':
                return action;
            case 'SAVE_TEAM_WRITE_DOC':
                return action;
            case 'NEW_TEAM_WRITE_DOC':
                return action;
            case 'LOAD_TEAM_WRITE_DOC':
                return action;
            case 'DELETE_TEAM_WRITE_DOC':
                return action;
            case 'TRASH_TEAM_WRITE_DOC':
                return action;
            case 'RESTORE_TEAM_WRITE_DOC':
                return action;
            case 'TEAM_WRITE_DOC_LOADED':
                return action;
            case 'TEAM_WRITE_READY':
                return action;
            case 'TEAM_WRITE_DOCUMENTS':
                return {
                    documents: action.payload,
                }
            default:
                return state;
    }
};
