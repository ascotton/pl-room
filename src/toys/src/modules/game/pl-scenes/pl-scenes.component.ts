import { Component,
                Input,
                OnInit,
                ElementRef,
                ViewChild,
                NgZone,
                OnDestroy,
            } from '@angular/core';

import { Store } from '@ngrx/store';
import { skip } from 'rxjs/operators';
import { AngularCommunicatorService } from
    '@app/downgrade/angular-communicator.service';

import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';

import { Sticker, StickerTemplate, PLScenesFactoryService } from './pl-scenes-factory.service';
import { selectCurrentUser } from '@modules/user/store';
import { AppState } from '@app/store';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pl-scenes',
    templateUrl: './pl-scenes.component.html',
    styleUrls: ['./pl-scenes.component.less'],
})
export class PLScenesComponent implements OnInit, OnDestroy {
    @Input() activity: any = {};
    @ViewChild('tray', { static: false }) tray;
    @ViewChild('scene', { static: false }) sceneView: ElementRef;

    usersSubscription: Subscription;

    stickers: Sticker[] = [];
    backgroundSrc: string;
    selectedSticker: Sticker;
    lastStickerDragX: number;
    lastStickerDragY: number;
    isOverTray = false;

    firebaseRef: any;

    trayScale = 0.5;
    readonly trayLeftPercent = 80;
    readonly trayCenterPercent = this.trayLeftPercent + (100 - this.trayLeftPercent) / 2;

    readonly fullScale = this.trayLeftPercent / 100;

    showPreview = false;
    previewSrc = '';
    showBackground = true;
    showStickers = true;
    storeSubscription: any;
    isProvider: boolean;

    constructor(
        public angularCommunicator: AngularCommunicatorService,
        private element: ElementRef,
        public scenesFactory: PLScenesFactoryService,
        private store: Store<AppState>,
        private zone: NgZone,
    ) {
    }
    initFirebase() {
        const fbPath = `activities/queues/items/${this.activity.queueId}/items/${this.activity.activityId}`;
        this.firebaseRef = this.angularCommunicator.getFirebaseRef(fbPath);

        this.firebaseRef.child('stickers').on('child_added', this.stickerUpdatedInFb);
        this.firebaseRef.child('stickers').on('child_changed', this.stickerUpdatedInFb);
        this.firebaseRef.child('stickers').on('child_removed', this.stickerRemovedInFb);
        this.firebaseRef.child('sceneName').on('value', (snap) => {
            const sceneName = snap.val();
            this.setSceneName(sceneName);
        });

        this.firebaseRef.child('showPreview').on('value', (snap) => {
            this.zone.run(() => {
                this.showPreview = snap.val();
            });
        });

        this.firebaseRef.child('showBackground').on('value', (snap) => {
            this.zone.run(() => {
                const val = snap.val();
                if (val !== null) {
                    this.showBackground = snap.val();
                }
            });
        });

        this.firebaseRef.child('showStickers').on('value', (snap) => {
            this.zone.run(() => {
                const val = snap.val();
                if (val !== null) {
                    this.showStickers = snap.val();
                }
            });
        });
    }

    stickerRemovedInFb = (snap) => {
        this.zone.run(() => {
            const removedSticker = snap.val();
            const existing = this.stickers.find(sticker => sticker.key === removedSticker.key);
            if (existing) {
                existing.fadeOut = true;
                // give 250ms for the fadeout animation to run
                setTimeout(() => {
                    const newStickers = this.stickers.filter(sticker => sticker.key !== removedSticker.key);
                    this.stickers = newStickers;
                }, 250);
            }
            this.updateSort();
        });
    }

    // stickers with baseLayer=true should go under other stickers. otherwise, sort by updated timestamp
    updateSort() {
        const sortbyUpdate = (a: Sticker, b: Sticker) => a.updated - b.updated;

        const baseStickers = this.stickers.filter(sticker => sticker.baseLayer).sort(sortbyUpdate);
        const topStickers = this.stickers.filter(sticker => !sticker.baseLayer).sort(sortbyUpdate);

        this.stickers = baseStickers.concat(topStickers);
    }

    stickerUpdatedInFb = (snap) => {
        this.zone.run(() => {
            const updatedSticker = snap.val();
            const existing = this.stickers.find(sticker => sticker.key === updatedSticker.key);
            if (existing) {
                existing.dragging = updatedSticker.dragging;
                existing.updated = updatedSticker.updated;
                // only animate if properties differ, meaning the change was remote, otherwise user
                // sees the sticker jump back and move again after they already dragged it
                if (existing.x !== updatedSticker.x ||
                    existing.y !== updatedSticker.y ||
                    existing.scaledWidth !== updatedSticker.scaledWidth
                    ) {
                    existing.remoteChange = true;
                    existing.x = updatedSticker.x;
                    existing.y = updatedSticker.y;
                    existing.scaledWidth = updatedSticker.scaledWidth;
                    existing.scaledHeight = updatedSticker.scaledHeight;
                    // give 350ms for animation to complete before unsetting remote change
                    setTimeout(() => {
                        existing.remoteChange = false;
                    },         350);
                }
            } else {
                this.stickers.push(updatedSticker);
            }
            this.updateSort();
        });
    }

    fbUpdateSticker(sticker: Sticker) {
        sticker.updated = new Date().getTime();
        this.firebaseRef.child('stickers/' + sticker.key).update(sticker);
        this.updateSort();
    }

    addNewSticker(stickerTemplate: StickerTemplate) {
        const newSticker: Sticker =
            this.scenesFactory.getStickerInstance(stickerTemplate);
        newSticker.width *= this.fullScale;
        newSticker.height *= this.fullScale;
        this.positionStickerInTray(newSticker, this.stickers.length);
        const newPostKey = this.firebaseRef.child('stickers').push().key;
        newSticker.key = newPostKey;
        this.fbUpdateSticker(newSticker);
    }

    private positionStickerInTray(sticker: Sticker, positionIndex) {
        sticker.scaledWidth = Math.min(Math.max(this.trayScale * sticker.width, 8), sticker.width);
        sticker.scaledHeight = sticker.height * sticker.scaledWidth / sticker.width;
        sticker.x = this.trayLeftPercent + 1 +
            Math.random() * (100 - this.trayLeftPercent - sticker.scaledWidth - 2);
        sticker.y = 2 + (positionIndex % 9) * 9;
    }

    resetValues(){
        this.stickers = [];
        this.backgroundSrc = '';
        this.selectedSticker = null;
        this.showPreview = false;
        this.previewSrc = '';
        this.showBackground = true;
        this.showStickers = true;
    }

    ngOnInit() {
        if (this.activity.type === 'game-potato-head') {
            this.scenesFactory.loadScenes('potato-head');
            this.trayScale = 0.3;
        } else {
            this.scenesFactory.loadScenes('default');
            this.trayScale = 0.5;
        }
        // this.resetValues();
        this.initFirebase();

        this.usersSubscription = this.store.select(selectCurrentUser)
            .subscribe((user) => {
                if (user && user.groups) {
                    this.isProvider = user.groups.indexOf('Provider') > -1 ||
                                      user.groups.indexOf('Service & Support') > -1 ||
                                      user.groups.indexOf('School Staff Providers') > -1 ||
                                      user.groups.indexOf('Private Practice') > -1;
                }
            });

        // call pipe(skip(1)) otherwise if the user exits and returns to this activity the last action
        // gets replayed, and if this was, e.g. SCENES_ADD_STICKERS you end up with an additional sticker
        this.storeSubscription = this.store.select('gameSceneBuilder').pipe(skip(1))
            .subscribe((data: any) => {
                const type = data.type;
                const payload = data.payload;
                switch (type) {
                        case 'SCENES_PREVIEW_TOGGLE':
                            this.firebaseRef.child('showPreview').set(payload.preview);
                            return;
                        case 'SCENES_BACKGROUND_TOGGLE':
                            this.firebaseRef.child('showBackground').set(payload.showBackground);
                            return;
                        case 'SCENES_STICKER_DISPLAY_TOGGLE':
                            this.firebaseRef.child('showStickers').set(payload.showStickers);
                            return;
                        case 'SCENES_ADD_STICKERS':
                            payload.newStickers.forEach(sticker => this.addNewSticker(sticker));
                            return;
                        case 'SCENES_CLEAR_TRAY_STICKERS':
                            this.clearTrayStickers();
                            return;
                        case 'SCENES_CLEAR_STICKERS':
                            const promises: Promise<any>[] = [];
                            this.stickers.forEach((sticker) => {
                                promises.push(this.firebaseRef.child('stickers/' + sticker.key).remove());
                            });
                            return;
                        case 'SCENES_SET_SCENE_NAME':
                            this.firebaseRef.child('sceneName').set(payload.sceneName);
                            return;
                }
            });
    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
        this.usersSubscription.unsubscribe();

        this.firebaseRef.child('stickers').off('child_added', this.stickerUpdatedInFb);
        this.firebaseRef.child('stickers').off('child_changed', this.stickerUpdatedInFb);
        this.firebaseRef.child('stickers').off('child_removed', this.stickerRemovedInFb);
    }

    private setSceneName(sceneName: string) {
        this.zone.run(() => {
            const selectedScene = this.scenesFactory.getSceneForName(sceneName);
            if (selectedScene && selectedScene.backgroundImageSrc) {
                this.backgroundSrc = selectedScene.backgroundImageSrc;
            } else {
                this.backgroundSrc = '';
            }
            if (selectedScene && selectedScene.previewSrc) {
                this.previewSrc = selectedScene.previewSrc;
            } else {
                this.previewSrc = '';
            }
        });
    }

    getTrayLeft() {
        return this.tray.nativeElement.getBoundingClientRect().left;
    }

    selectSticker(sticker: Sticker) {
        // can't touch something already being dragged
        if (sticker.dragging) {
            return;
        }

        if (this.selectedSticker) {
            this.selectedSticker.selected = false;
        }
        sticker.dragging = true;
        sticker.selected = true;
        this.fbUpdateSticker(sticker);
    }

    deselectSticker(sticker: Sticker) {
        setTimeout(() => {
            // if (sticker.dragging) {
            //     return;
            // }
            sticker.dragging = false;
            sticker.selected = false;
            this.fbUpdateSticker(sticker);

        }, 100);
    }

    stickerDragStarted(evt: CdkDragStart, sticker: Sticker) {
        // splice the sticker out and push to the end of the array so it lands on top of the stack of stickers
        // in rendering
        this.stickers.splice(this.stickers.indexOf(sticker), 1);
        this.stickers.push(sticker);

        this.selectedSticker = sticker;
        sticker.dragging = true;
        this.fbUpdateSticker(sticker);
        if (sticker.scaledWidth !== sticker.width) {
            sticker.x -= sticker.width / 2;
            sticker.scaledWidth = sticker.width;
            sticker.scaledHeight = sticker.height;
        }
    }

    stickerDragEnded(evt: CdkDragEnd, sticker: Sticker) {
        evt.source.reset();
        const boundrect = this.element.nativeElement.getBoundingClientRect();
        sticker.x += 100 * evt.distance.x / boundrect.width;
        sticker.y += 100 * evt.distance.y / boundrect.height;

        const stickerRight = sticker.x + sticker.scaledWidth;
        const stickerBottom = sticker.y + sticker.scaledHeight;

        // Commenting this out for now, as design didn't get it, but I all but guarantee they'll want
        // it back later.

        if (sticker.x > 100 || stickerRight < 1 || sticker.y > 100 || stickerBottom < 0) {
            if (this.isProvider && sticker.x > 100) {  // if provider drags off workspace, delete sticker
                this.firebaseRef.child('stickers/' + sticker.key).remove();
                this.isOverTray = false;
                return;
            } else { // if student drags off workspace, nudge it back
                sticker.x = sticker.x > 100 ? this.trayLeftPercent + 1 : sticker.x;
                sticker.x = stickerRight < 1 ? 0 : sticker.x;
                sticker.y = sticker.y > 99 ? 95 : sticker.y;
                sticker.y = stickerBottom < 1 ? 0 : sticker.y;
            }
        }

        if (this.isOverTray) {
            sticker.scaledWidth = Math.min(Math.max(this.trayScale * sticker.width, 8), sticker.width);
            sticker.scaledHeight = sticker.height * sticker.scaledWidth / sticker.width;
            if (sticker.x < this.trayLeftPercent) {
                sticker.x = this.trayLeftPercent + 1;
            }
        } else {
            sticker.scaledWidth = sticker.width;
            sticker.scaledHeight = sticker.height;
        }

        this.isOverTray = false;
        sticker.selected = false;
        sticker.dragging = false;
        this.fbUpdateSticker(sticker);
    }

    stickerDragMoved(evt: CdkDragMove, sticker: Sticker) {
        this.updateIsOverTray(evt.pointerPosition.x);
        // sticker.scaledWidth = this.isOverTray ? this.trayScale * sticker.width : sticker.width;
    }

    private updateIsOverTray(xPos) {
        const bounds = this.element.nativeElement.getBoundingClientRect();
        this.isOverTray = xPos - bounds.left > this.trayLeftPercent * bounds.width / 100;
    }

    clearTrayStickers() {
        this.stickers.forEach(sticker => {
            if (sticker.x > this.trayLeftPercent) {
                this.firebaseRef.child('stickers/' + sticker.key).remove();
            }
        });
    }

    resetSceneStickers() {
        let i=0;
        this.stickers.forEach((sticker) => {
            if (sticker.x < this.trayLeftPercent) {
                setTimeout((index) => {
                    // make a clone for the firebase update so the position update and corresponding animation
                    // gets handled in the firebase callback
                    const clone = Object.assign({}, sticker);
                    this.positionStickerInTray(clone, index);
                    this.fbUpdateSticker(clone);
                }, i * 400, i);
                i++;
            }
        });
    }
}
