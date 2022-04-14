import { Component, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';

import { environment } from '@root/src/environments/environment';

import { AngularCommunicatorService } from '@app/downgrade/angular-communicator.service';

@Component({
    selector: 'pl-common-overlays',
    templateUrl: './pl-common-overlays.component.html',
    styleUrls: ['./pl-common-overlays.component.less'],
})
export class PLCommonOverlaysComponent {
    @ViewChild("iframeWhiteboard") iframeWhiteboard: ElementRef;

    active = false;
    actives = {
        tour: false,
        iFrameWhiteboard: false,
    };
    iFrameWhiteboardSrc: any = '';
    iFrameWhiteboardStyles: any = {};
    iFrameWhiteboardCloseStyles: any = {};

    constructor(
        private angularCommunicator: AngularCommunicatorService,
        private sanitizer: DomSanitizer,
        private store: Store<any>,
    ) {
        $(window).on('resize', () => {
            if (this.active && this.actives.iFrameWhiteboard) {
                this.sizeIFrameWhiteboard();
            }
        });
    }

    ngOnInit() {
        this.store.select('overlaysStore')
            .subscribe((data: any) => {
                if (data.activeTour !== undefined) {
                    this.actives.tour = data.activeTour;
                    this.updateActive();
                }
                if (data.activeIFrameWhiteboard !== undefined) {
                    if (data.activeIFrameWhiteboard) {
                        this.angularCommunicator.updateFirebaseRef({ fullscreen: 'normal' });
                        // Wait for video mode animation to finish.
                        setTimeout(() => {
                            this.setActiveIFrameWhiteboard(data.activeIFrameWhiteboard);
                        }, 10);
                        setTimeout(() => {
                            this.sizeIFrameWhiteboard();
                        }, 1000);
                    } else {
                        this.setActiveIFrameWhiteboard(data.activeIFrameWhiteboard);
                    }
                }
            });

        window.addEventListener("message", (event) => {
            if (!event.origin.includes(`${environment.apps.flutterApp.url}`)) {
                return;
            }
            var data = event.data.data;
            if (data && data.goBack) {
                this.clickClose();
            }
        }, false);
    }

    setActiveIFrameWhiteboard(active) {
        this.actives.iFrameWhiteboard = active;
        this.updateActive();

        const url = `${environment.apps.flutterApp.url}/#/image-decks?iframe=1&provideronly=1`;
        this.iFrameWhiteboardSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);

        this.sizeIFrameWhiteboard();
    }

    sizeIFrameWhiteboard() {
        const coords = this.getWhiteboardSize();
        this.iFrameWhiteboardStyles.left = `${coords.left}px`;
        this.iFrameWhiteboardStyles.width = `${coords.width}px`;
        this.iFrameWhiteboardStyles.top = `${coords.top}px`;
        this.iFrameWhiteboardStyles.height = `${coords.height}px`;

        this.iFrameWhiteboardCloseStyles.top = `${(coords.top + 10)}px`;
        this.iFrameWhiteboardCloseStyles.left = `${(coords.left + coords.width - 30)}px`;
    }

    updateActive() {
        let atLeastOneActive = false;
        for (let key in this.actives) {
            if (this.actives[key]) {
                atLeastOneActive = true;
                break;
            }
        }
        if (atLeastOneActive) {
            this.active = true;
        } else {
            this.active = false;
        }
    }

    setNotActive(key) {
        this.actives[key] = false;
        this.updateActive();
    }

    startTour() {
        this.setNotActive('tour');
        this.store.dispatch({ type: 'UPDATE_OVERLAYS', payload: { startTour: true } });
    }

    clickBackground() {
        // if (this.active && this.actives.iFrameWhiteboard) {
        //     this.setNotActive('iFrameWhiteboard');
        // }
    }

    clickClose() {
        if (this.active && this.actives.iFrameWhiteboard) {
            this.store.dispatch({ type: 'UPDATE_OVERLAYS', payload: { activeIFrameWhiteboard: false } });
            this.setNotActive('iFrameWhiteboard');
        }
    }

    getWhiteboardSize() {
        const ele: any = document.getElementsByClassName("central-content")[0];
        return {
            'left': ele.offsetLeft,
            'width': ele.offsetWidth,
            'top': ele.offsetTop,
            'height': ele.offsetHeight,
        }
    }
}
