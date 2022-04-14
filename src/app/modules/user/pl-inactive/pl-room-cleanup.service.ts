import { Injectable } from '@angular/core';

import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';

@Injectable()
export class PLRoomCleanupService {
    firebaseRefs: any = null;
    notification: any = null;

    constructor(private currentUserModel: CurrentUserModel) {}

    setVars(firebaseRefs, notification) {
        if (firebaseRefs) {
            this.firebaseRefs = firebaseRefs;
        }
        if (notification) {
            this.notification = notification;
        }
    }

    cleanup(isStudent) {
        this.cleanupUser(isStudent);
    }

    // Note: the ng1 code calls this for both local and local2 (if it exists). However, the code below
    // seems to be user based, so assuming only 1 user, should only need to be done per user, not per stream?
    cleanupUser(isStudent) {
        // Send a firebase update that this user (both streams if have 2nd stream (document camera)).
        // UPDATE: this just seems to logout the current user, which we do not want to do,
        // and it does not appear to do anything else?
        // Update 2: If fire this, even with the new key, it breaks the provider view
        // (no more icons on video to stop / start).
        // const state: string = 'dismissed';
        // const state: string = 'inactivedismissed';
        // this.firebaseRefs.user.update({
        //     state,
        // });
        if (isStudent) {
            this.currentUserModel.logout();
        }

        // Close any notifications.
        if (this.notification) {
            this.notification.close();
        }
    }
}
