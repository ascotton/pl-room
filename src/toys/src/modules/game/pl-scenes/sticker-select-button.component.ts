import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';

import  { StickerTemplate } from './pl-scenes-factory.service';
@Component({
    selector: 'sticker-select-button',
    templateUrl: './sticker-select-button.component.html',
    styleUrls: ['./sticker-select-button.component.less'],
})
export class StickerSelectButtonComponent implements OnInit, OnChanges {
    @Input() sticker: StickerTemplate;
    @Input() disabled = false;
    @Output() readonly stickerClicked = new EventEmitter<any>();

    constructor(
    ) {
    }

    ngOnInit() {
    }
    ngOnChanges(changes: any) {
    }

    clickedSticker() {
        if (!this.disabled) {
            this.stickerClicked.emit(this.sticker);
        }
    }

    // toggleSticker() {
    //     this.sticker.buttonSelected = !this.sticker.buttonSelected;
    // }

}
