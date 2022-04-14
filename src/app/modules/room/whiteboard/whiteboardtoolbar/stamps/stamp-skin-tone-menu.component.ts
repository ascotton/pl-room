class StampSkinToneMenuController {
    static $inject = ['stampModel'];

    skinTone = '';
    stampModel;

    constructor(stampModel) {
        this.stampModel = stampModel;
        this.skinTone = stampModel.getSkinTone();
    }
}

export default StampSkinToneMenuController;

import { whiteboardToolbarModule } from '../whiteboard-toolbar.module';

const stampSkinToneMenuComponent = whiteboardToolbarModule.component('stampSkinToneMenu', {
    template: require('./stamp-skin-tone-menu.component.html'),
    bindings: {
    },
    controller: StampSkinToneMenuController,
});
