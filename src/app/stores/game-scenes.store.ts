export function gameSceneBuilder(state: any = {}, action: any) {
    const type = action.type;
    const payload = action.payload;
    switch (type) {
            case 'SCENES_BACKGROUND_TOGGLE':
            case 'SCENES_PREVIEW_TOGGLE':
            case 'SCENES_STICKER_DISPLAY_TOGGLE':
            case 'SCENES_INITIALIZE_SCENES':
            case 'SCENES_CLEAR_TRAY_STICKERS':
                return action;
            case 'SCENES_ADD_STICKERS':
                if (!state.stickers) {
                    state.stickers = [];
                }
                state.stickers.push(...payload.newStickers);
                return action;
            case 'SCENES_CLEAR_STICKERS':
                state.stickers = [];
                return action;
            case 'SCENES_SET_SCENE_NAME':
                state.sceneName = payload.sceneName;
                return action;
            default:
                return state;
    }
}
