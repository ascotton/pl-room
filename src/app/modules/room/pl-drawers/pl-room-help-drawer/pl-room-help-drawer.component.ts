import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppStore } from '@app/appstore.model';

import { CurrentUserModel } from '@common/models/CurrentUserModel';
import { IntrojsService } from '@common/services-ng2/introjs.service';
import { PLDrawerPanelComponent } from '../pl-drawer-panel/pl-drawer-panel.component';
@Component({
    selector: 'pl-room-help-drawer',
    templateUrl: './pl-room-help-drawer.component.html',
    styleUrls:  ['./pl-room-help-drawer.component.less'],
})

export class PLRoomHelpDrawerComponent implements AfterViewInit {
    @ViewChild(PLDrawerPanelComponent) linkPanel: PLDrawerPanelComponent;

    @Input() active = false;
    roomHelpDrawerActive: boolean;
    screenshareElement: any;

    defaultCopyButtonText = 'Copy URL';
    copyButtonText = this.defaultCopyButtonText;

    username = '';

    isSSP = false;

    constructor(private currentUser: CurrentUserModel,
                private introjsService: IntrojsService,
                private store: Store<AppStore>,
                ) {

        this.store.select('firebaseStateStore').subscribe(
            (data: any) => {
                if (!data) {
                    return;
                }
                const type = data.type;
                const payload = data.payload;
                switch (type) {
                        case 'FIREBASE_UPDATE':
                            this.roomHelpDrawerActive = payload.RoomHelpDrawerActive;
                            return;
                }
            },
        );

        this.isSSP = (this.currentUser.user.groups.some((g: any) => g.indexOf('School Staff') >= 0));
        const user: any = this.currentUser.user;
        this.username = user.username;
    }

    ngAfterViewInit() {
        this.linkPanel.open();
    }

    copyUrl() {
        const url = `https://room.presencelearning.com/${this.username}`;
        navigator.clipboard.writeText(url);
        this.copyButtonText = 'URL Copied!';
        setTimeout(
            () => {
                this.copyButtonText = this.defaultCopyButtonText;
            },
            2000,
        );
    }

    startTour() {
        this.introjsService.roomOverview();
    }
}
