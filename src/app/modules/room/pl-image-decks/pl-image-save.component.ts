import { Component, Output, EventEmitter } from '@angular/core';

import { PLImageSaveService } from './pl-image-save.service';

@Component({
    selector: 'pl-image-save',
    templateUrl: './pl-image-save.component.html',
    styleUrls: ['./pl-image-save.component.less']
})
export class PLImageSaveComponent {
    @Output() onSave = new EventEmitter<any>();

    imageData: any = {
        id: '',
        url: '',
        title: '',
        // tags: '',

    };
    loading = false;

    constructor(
        private plImageSaveService: PLImageSaveService,
    ) {
    }

    save() {
        if (!this.imageData.title || !this.imageData.url) {
            return;
        }

        this.loading = true;
        const imgEle = document.querySelector('.pl-image-save img.image');
        this.plImageSaveService.save(this.imageData.url, this.imageData.title, this.imageData.id, imgEle).subscribe((res: any) => {
            this.imageData = Object.assign(this.imageData, res);
            this.imageData.thumbnail_url = this.imageData.url;
            this.loading = false;
            this.onSave.emit({ imageData: this.imageData });
            this.imageData = {
                id: '',
                url: '',
                title: '',
            };
        }, (err) => {
            this.loading = false;
        });
    }

}
