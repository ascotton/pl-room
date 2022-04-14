import { Component, Input, OnInit, NgZone } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppStore } from '@app/appstore.model';

import { AngularCommunicatorService } from '@app/downgrade/angular-communicator.service';

import  { PLScenesFactoryService, StickerTemplate } from './pl-scenes-factory.service';

@Component({
    selector: 'pl-scenes-drawer',
    templateUrl: './pl-scenes-drawer.component.html',
    styleUrls: ['./pl-scenes-drawer.component.less'],
})
export class PLScenesDrawerComponent implements OnInit {
    @Input() activeDrawer = true;
    @Input() activity: any;
    sceneBuilderisActive: boolean;
    _selectedSceneName = '';
    _selectedStickerPackName = '';
    selectedStickerPackButtons: StickerTemplate[];
    sceneOptions: { value: string; label: string; }[];
    stickerOptions: { value: string; label: string; }[];
    previewSelected = false;
    hideStickersSelected = false;

    firebaseRef: any;

    constructor(
        public scenesFactory: PLScenesFactoryService,
        private store: Store<AppStore>,
        private angularCommunicator: AngularCommunicatorService,
        private zone: NgZone,
    ) {
    }

    ngOnInit() {
        if (this.activity.type === 'game-potato-head') {
            this.scenesFactory.loadScenes('potato-head');
        } else {
            this.scenesFactory.loadScenes('default');
        }
        this.sceneOptions = [{ value: 'blank', label: 'Blank' }].concat(this.scenesFactory.sceneOptions);
        this.stickerOptions = this.scenesFactory.stickerOptions;

        // TODO - move all this to a store/effect?
        const fbPath = `activities/queues/items/${this.activity.queueId}/items/${this.activity.activityId}`;
        this.firebaseRef = this.angularCommunicator.getFirebaseRef(fbPath);
        this.firebaseRef.child('sceneName').once('value', (snap) => {
            this.zone.run(() => {
                const val = snap.val();
                this.selectedSceneName = val;
            });
        });
        this.firebaseRef.child('showPreview').once('value', (snap) => {
            this.zone.run(() => {
                const val = snap.val();
                this.previewSelected = val;
            });
        });
        this.firebaseRef.child('showStickers').once('value', (snap) => {
            this.zone.run(() => {
                let val = snap.val();
                if (val !== null) {
                    this.hideStickersSelected = !val;
                }
            });
        });
    }

    togglePreview() {
        this.store.dispatch({ type: 'SCENES_PREVIEW_TOGGLE', payload: { preview: this.previewSelected } });
    }
    toggleHideStickers() {
        this.store.dispatch({ type: 'SCENES_STICKER_DISPLAY_TOGGLE', payload: { showStickers: !this.hideStickersSelected } });
    }

    resetGame() {
        this.selectedSceneName = '';
        this.selectedStickerPackName = '';
        this.hideStickersSelected = false;
        this.previewSelected = false;

        this.togglePreview();
        this.toggleHideStickers();
        this.clearStickers();

    }

    public set selectedSceneName(sceneName: string) {
        this._selectedSceneName = sceneName;
        if (this._selectedSceneName !== 'blank' && !this._selectedStickerPackName) {
            const scene = this.scenesFactory.getSceneForName(sceneName);
            if (scene && scene.stickerPackName) {
                this.selectedStickerPackName = scene.stickerPackName;
            }
        }
        this.store.dispatch({ type: 'SCENES_SET_SCENE_NAME', payload: { sceneName: this._selectedSceneName } });
    }
    public get selectedSceneName() {
        return this._selectedSceneName;
    }

    public set selectedStickerPackName(packName: string) {
        this._selectedStickerPackName = packName;
        if (packName === 'blank' || packName === '' || packName === null) {
            this.selectedStickerPackButtons = [];
        } else {
            const stickerPack = this.scenesFactory.getStickerButtonsPackForName(packName);
            if (stickerPack) {
                this.selectedStickerPackButtons = stickerPack.stickerButtons;
            }
        }
    }
    public get selectedStickerPackName() {
        return this._selectedStickerPackName;
    }

    addAll() {
        if (this.selectedStickerPackButtons) {
            this.store.dispatch({ type: 'SCENES_ADD_STICKERS',
                payload: { newStickers: this.selectedStickerPackButtons } });
        }
    }
    stickerClicked(sticker) {
        this.store.dispatch({ type: 'SCENES_ADD_STICKERS', payload: { newStickers: [sticker] } });
    }
    addSelected() {
        const selected = [];
        this.selectedStickerPackButtons.forEach((sticker) => {
            if (sticker.buttonSelected) {
                selected.push(sticker);
            }
        });
        this.store.dispatch({ type: 'SCENES_ADD_STICKERS', payload: { newStickers: selected } });

    }
    clearStickers() {
        this.store.dispatch({ type: 'SCENES_CLEAR_STICKERS', payload: { clearStickers: true } });
    }

    clearTrayStickers() {
        this.store.dispatch({ type: 'SCENES_CLEAR_TRAY_STICKERS', payload: { clearStickers: true } });
    }
}
