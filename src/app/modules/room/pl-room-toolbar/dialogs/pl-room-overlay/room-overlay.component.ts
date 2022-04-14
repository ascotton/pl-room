import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { OverlayColor, PLRoomOverlayService } from '../../../pl-room-overlay/pl-room-overlay.service';

@Component({
    selector: 'pl-room-overlay-dialog',
    templateUrl: 'room-overlay.component.html',
    styleUrls: ['./room-overlay.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLRoomOverlayDialogComponent implements OnInit {
    constructor(private roomOverlayService: PLRoomOverlayService) { }

    ngOnInit() {

    }

    get overlayEnabled() {
        return this.roomOverlayService.overlayEnabled;
    }

    set overlayEnabled(val) {
        this.roomOverlayService.overlayEnabled = val;
    }

    get colors() {
        return this.roomOverlayService.colors;
    }

    get overlayOpacity() {
        return this.roomOverlayService.overlayOpacity;
    }

    set overlayOpacity(val) {
        this.roomOverlayService.overlayOpacity = val;
    }

    get opacityPercentage() {
        return Math.floor(this.overlayOpacity * 100);
    }

    get overlayColor() {
        return this.roomOverlayService.overlayColor;
    }

    onSelectColor(color: OverlayColor) {
        this.roomOverlayService.overlayColor = color;
    }

    getColorStyle(color: OverlayColor) {
        return {
            backgroundColor: color.value,
            opacity: this.overlayOpacity,
        };
    }

    onOverlayOpacityChanged(ev: MatSliderChange) {
        this.overlayOpacity = ev.value;
    }

}
