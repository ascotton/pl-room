import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PLRoomOverlayService } from './pl-room-overlay.service';

@Component({
    selector: 'pl-room-overlay',
    templateUrl: 'pl-room-overlay.component.html',
    styleUrls: ['./pl-room-overlay.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLRoomOverlayComponent implements OnInit {

    constructor(private roomOverlayModel: PLRoomOverlayService) { }

    ngOnInit() {

    }

    get overlayColor() {
        return this.roomOverlayModel.overlayColor.value;
    }

    get overlayEnabled() {
        return this.roomOverlayModel.overlayEnabled;
    }

    get overlayOpacity() {
        return this.roomOverlayModel.overlayOpacity;
    }
}
