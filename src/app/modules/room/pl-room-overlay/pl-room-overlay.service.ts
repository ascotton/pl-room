import { Injectable, NgZone } from '@angular/core';
import { FirebaseModel } from '@root/src/app/common/models/firebase/FirebaseModel';
import { find } from 'lodash';
export interface OverlayColor {
    name: string;
    value: string;
}
@Injectable()
export class PLRoomOverlayService {
    colors: OverlayColor[] = [
        { name: 'Turquoise', value: '#008888' },
        { name: 'Yellow', value: '#d7c700' },
        { name: 'Goldenrod', value: '#ffb800' },
        { name: 'Peach', value: '#cd804e' },
        { name: 'Rose', value: '#c31e10' },
        { name: 'Purple', value: '#662b8f' },
        { name: 'Blue', value: '#0237a1' },
        { name: 'Green', value: '#46ae49' },
        { name: 'Gray', value: '#696969' },
        { name: 'Blue-Gray', value: '#96a9bb' },
    ];
    private DEFAULT_OPACITY = 0.5;
    private DEFAULT_COLOR = this.colors[0];

    _overlayColor: any;
    _overlayOpacity: number;
    _overlayEnabled: boolean;
    ref: any;

    constructor(firebaseModel: FirebaseModel, zone: NgZone) {

        this._overlayColor = this.DEFAULT_COLOR;
        this._overlayOpacity = this.DEFAULT_OPACITY;
        this._overlayEnabled = false;

        this.ref = firebaseModel.getFirebaseRef('roomOverlay');

        this.ref.on('value', (snap) => {
            const value = snap.val();
            if (value) {
                zone.run(() => {
                    // if there's an overlayColorValue, update _overlayColor to the color that value corresponds to
                    if (value.overlayColorValue !== null && value.overlayColorValue !== undefined) {
                        this._overlayColor = find(this.colors, color => color.value === value.overlayColorValue);
                    } else {
                        this.overlayColor = this.DEFAULT_COLOR;
                    }
                    if (value.overlayOpacity !== null && value.overlayOpacity !== undefined) {
                        this._overlayOpacity = value.overlayOpacity;
                    } else {
                        this.overlayOpacity = this.DEFAULT_OPACITY;
                    }
                    this._overlayEnabled = value.overlayEnabled;
                });
            }
        });
    }

    // Only write the color value, not the whole color object, to firebase
    set overlayColor(val) {
        this.ref.child('overlayColorValue').set(val.value);
    }

    get overlayColor() {
        return this._overlayColor;
    }

    set overlayOpacity(val) {
        this.ref.child('overlayOpacity').set(val);
    }

    get overlayOpacity() {
        return this._overlayOpacity;
    }

    set overlayEnabled(val) {
        this.ref.child('overlayEnabled').set(val);
    }

    get overlayEnabled() {
        return this._overlayEnabled;
    }
}
