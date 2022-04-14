export interface DocumentationNotes {
    speakingInstanceId: string;
}

export function documentationNotes(state: any = {}, action: any) {
    const type = action.type;
    const payload = action.payload;
    switch (type) {
        case 'UPDATE_DOCUMENTATION_NOTES':
            return payload;
        default:
            return state;
    }
}
