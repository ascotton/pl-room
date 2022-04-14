import { Injectable } from '@angular/core';
import { defaultScenes, defaultStickerPacks } from './pl-scenes-data-default.const';
import { potatoHeadScenes, potatoHeadStickerPacks } from './pl-scenes-data-potatohead.const';

export interface SceneDescription  {
    displayName?: string;
    name: string;
    location?: string;
    background: string;
    backgroundImageSrc?: string;
    backgroundImageSuffix?: string;
    preview?: string;
    previewSrc?: string;
    stickerPackName?: string;
}
export interface StickerDescription {
    name: string;
    displayName?: string;
    width: number;
    height: number;
    baseLayer?: boolean;
}
export interface StickerPackDescription {
    name: string;
    displayName?: string;
    location?: string;
    stickers: StickerDescription[];
}

export interface Sticker {
    sceneName?: string;
    imageSrc: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    displayName: string;
    baseLayer?: boolean;
    key?: string;
    scaledWidth?: number;
    scaledHeight?: number;
    selected?: boolean;
    dragging?: boolean;
    fadeOut?: boolean;
    updated?: number;
    remoteChange?: boolean;
}
export interface StickerTemplate {
    stickerSetName: string;
    imageSrc: string;
    name: string;
    buttonSelected: boolean;
    displayName: string;
}

@Injectable()
export class PLScenesFactoryService {

    readonly SCENE_ASSET_DIR = `https://cdn.presencelearning.com/scenes/`;

    // readonly SCENE_ASSET_DIR = '../../../assets/scenes/scenes/';

    sceneNames: string[] = [];
    sceneOptions: {value: string, label: string}[] = [];
    stickerOptions: {value: string, label: string}[] = [];
    scenes: SceneDescription[];

    stickerButtonsPacks: {name: string, stickerButtons: StickerTemplate[]}[] = [];
    stickerPacks: StickerPackDescription[];
    constructor() {}

    loadScenes(scenePackName: string) {
        if (scenePackName === 'potato-head') {
            this.scenes = potatoHeadScenes;
            this.stickerPacks = potatoHeadStickerPacks;
        } else {
            this.scenes = defaultScenes;
            this.stickerPacks = defaultStickerPacks;
        }

        this.sceneOptions = [];
        this.sceneNames = this.scenes.map(scene => scene.name);
        this.scenes.forEach((scene) => {
            if (scenePackName === 'potato-head') {
                this.sceneOptions.push({ value: scene.background, label: scene.displayName });
            } else {
                this.sceneOptions.push({ value: scene.name, label: scene.displayName });
            }
            // define preload background and preview images
            const location = scene.location ? scene.location : scene.name;
            if (scene.background) {
                const bgImage: any = new Image();
                scene.backgroundImageSrc = this.imageSrc(location, scene.background, scene.backgroundImageSuffix);
                bgImage.src = scene.backgroundImageSrc;
            }

            if (scene.preview) {
                scene.previewSrc = this.imageSrc(location, scene.preview);
                const previewImage: any = new Image();
                previewImage.src = scene.previewSrc;
            }
        });
        this.stickerButtonsPacks = [];
        this.stickerOptions = [];
        this.stickerPacks.forEach((pack) => {
            const name = pack.name;
            const stickerButtons =
                pack.stickers.map(sticker => this.getStickerButton(name, sticker, pack.location));
            this.stickerButtonsPacks.push({ name, stickerButtons });
            this.stickerOptions.push({ value: name, label: pack.displayName });
        });
    }

    getStickerButtonsPackForName(name) {
        return this.stickerButtonsPacks.find(pack => pack.name === name);
    }

    getDisplayName(name: string): string {
        let tokens = name.split('-');
        tokens = tokens.map(token => token.charAt(0).toUpperCase() + token.slice(1));
        return tokens.join(' ');
    }

    getStickerButton(stickerSetName: string, sticker: any, location?: string): StickerTemplate {
        const stickerLocation = location ? location : stickerSetName;
        return  {
            stickerSetName,
            imageSrc: this.imageSrc(stickerLocation, sticker.name),
            name: sticker.name,
            buttonSelected: false,
            displayName: sticker.displayName ? sticker.displayName  : this.getDisplayName(sticker.name),
        };
    }

    getStickerInstance(stickerTemplate: StickerTemplate): Sticker {
        const pack = this.stickerPacks.find(p => p.name === stickerTemplate.stickerSetName);
        if (pack) {
            const sticker = pack.stickers.find(s => s.name === stickerTemplate.name);
            const stickerLocation = pack.location ? pack.location : pack.name;
            if (sticker) {
                const instance: Sticker = {
                    imageSrc: this.imageSrc(stickerLocation, sticker.name),
                    name: sticker.name,
                    x: 0,
                    y: 0,
                    width: 1 * sticker.width,
                    height: 1 * sticker.height,
                    baseLayer: sticker.baseLayer ? true : false,
                    displayName:  sticker.displayName ? sticker.displayName  : this.getDisplayName(sticker.name)
                };
                return instance;
            }
        }
        return null;
    }

    getSceneForName(sceneName: string): SceneDescription {
        return this.scenes.find(scene => scene.name === sceneName);
    }

    imageSrc(stickerLocation: string, imageName: string, suffix?: string): string {
        const imgSuffix = suffix ? suffix : 'svg';
        return `${this.SCENE_ASSET_DIR}${stickerLocation}/${imageName}.${imgSuffix}`;
    }
}
