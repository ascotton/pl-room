import { Component, Input, Output, EventEmitter } from '@angular/core';

import {
    PLHttpService,
    PLUrlsService,
} from '@root/index';

@Component({
    selector: 'pl-activity-view',
    templateUrl: './pl-activity-view.component.html',
    styleUrls: ['./pl-activity-view.component.less']
})
export class PLActivityViewComponent {
    @Input() activity: any = {
        uuid: '',
        id: '',
        title: '',
        description: '',
        imageUrl: '',
        images: [],
        owner: '',
        userFavorite: false,
        tags: [],
        private: true,
        activity_type: '',
        imageDeck: {},
    };
    @Output() onCancel = new EventEmitter<any>();

    constructor(
        private plHttp: PLHttpService,
        private plUrls: PLUrlsService,
    ) {
    }

    ngOnInit() {
        this.formatActivity();
    }

    ngOnChanges(changes) {
        if (changes.activity) {
            this.formatActivity();
        }
    }

    formatActivity() {
        const activity = Object.assign({
            title: '',
            imageDeck: {},
        }, this.activity);
        this.activity = activity;
        // Check descriptor for additional data (e.g. imageDeck).
        const descriptor = this.activity.descriptor ? JSON.parse(this.activity.descriptor) : {};
        if (descriptor.imageDeck) {
            this.loadImageDeck(descriptor.imageDeck);
        }
    }

    loadImageDeck(imageDeck) {
        const url = `${this.plUrls.urls.activity}${imageDeck.id}/`;
        const data = {
            id: imageDeck.id,
        };
        this.plHttp.get('', data, url).subscribe((res: any) => {
            const descriptor = res.descriptor ? JSON.parse(res.descriptor) : {};
            const images = descriptor.images || [];
            this.activity.imageDeck = Object.assign(res, {
                imageUrl: res.thumbnail_url,
                title: res.name,
                images: images,
            });
        });
    }

    cancel() {
        this.onCancel.emit({});
    }
}
