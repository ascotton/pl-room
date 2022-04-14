import { ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
import { PLUrlsService } from '@root/src/lib-components';

@Component({
    selector: 'pl-room-link-dialog',
    templateUrl: 'pl-room-link-dialog.component.html',
    styleUrls: ['./pl-room-link-dialog.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLRoomLinkDialogComponent implements OnInit {
    copyingLink = false;
    roomUrl = '';

    constructor(private bottomsheet: MatBottomSheetRef<PLRoomLinkDialogComponent>,
                private changeDetector: ChangeDetectorRef,
                plUrls: PLUrlsService,
                currentUser: CurrentUserModel) {
        this.roomUrl = `${plUrls.urls.roomFE}/${(currentUser.user as any).username}`;
    }

    ngOnInit() {

    }

    onClose() {
        this.bottomsheet.dismiss();
    }

    onCopyLink() {
        this.copyingLink = true;
        setTimeout(() => {
            this.copyingLink = false;
            this.changeDetector.detectChanges();
        },         2000);
    }
}
