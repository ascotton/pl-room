import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import introJs from 'intro.js/intro.js';

import { AngularCommunicatorService } from
    '@app/downgrade/angular-communicator.service';
import { selectCurrentUser } from '@modules/user/store';

@Injectable()
export class IntrojsService {
    roomOverviewOn = false;
    tokboxConnected = false;
    intro = null;
    whiteboardActive = false;
    firebaseRefApp;
    currentUser: any = {};
    localStorageKey = 'introjs';

    // any time we want to force everyone to view the intro again, change this flag name
    localStorageFlag = 'newVideoOverviewDone';
    localStorageData: any = {};

    constructor(
        private store: Store<any>,
        private angularCommunicator: AngularCommunicatorService,
    ) {
        store.select('tokboxStore').subscribe((data: any) => {
            if (data.connected !== undefined) {
                this.tokboxConnected = data.connected;
                if (this.tokboxConnected && this.roomOverviewOn && this.mayViewRoomOverview()) {
                    setTimeout(() => {
                        this.roomOverviewActual();
                    }, 1000);
                }
            }
        });

        store.select(selectCurrentUser)
            .subscribe((user) => {
                this.currentUser = user;
                if (this.roomOverviewOn && this.mayViewRoomOverview()) {
                    this.roomOverviewActual();
                }
            });

        store.select('overlaysStore')
            .subscribe((data: any) => {
                if (data.startTour !== undefined && data.startTour) {
                    this.roomOverviewTour();
                }
            });

        this.getFirebaseData();
        this.checkLocalstorage();
    }

    checkLocalstorage() {
        let data: any = localStorage.getItem(this.localStorageKey);
        if (data) {
            data = JSON.parse(data);
            if (!data[this.localStorageFlag]) {
                this.roomOverview();
            }
        } else {
            this.roomOverview();
        }
    }

    // No way to remove steps? So need to reset variable each time?
    initIntroJS() {
        this.intro = introJs();
        this.intro.setOptions({
            tooltipClass: 'intro-js-override',
            highlightClass: 'intro-js-highlight-override',
            overlayOpacity: 0.3,
            showStepNumbers: false,
            showBullets: false,
            showProgress: true,
            skipLabel: 'Close',
            exitOnOverlayClick: false,
            hideNext: true,
            hidePrev: true,
            doneLabel: 'Done',
        });
    }

    getFirebaseData() {
        this.firebaseRefApp = this.angularCommunicator.getFirebaseRef('app');
        if (this.firebaseRefApp) {
            this.firebaseRefApp.on('value', (snapshot) => {
                const val = snapshot.val();
                this.whiteboardActive = val.whiteboardActive;
            });
        }
    }

    roomOverview() {
        this.roomOverviewOn = true;
        if (this.tokboxConnected && this.mayViewRoomOverview()) {
            this.roomOverviewActual();
        }
    }

    mayViewRoomOverview() {
        if (this.currentUser.uuid && (this.currentUser.groups.includes('Provider') ||
            this.currentUser.groups.includes('Therapist') ||
            this.currentUser.groups.includes('School Staff Providers') ||
            this.currentUser.groups.includes('Private Practice'))) {
            return true;
        }
        return false;
    }

    roomOverviewActual() {
        this.roomOverviewOn = false;
        this.store.dispatch({ type: 'UPDATE_OVERLAYS', payload: { activeTour: true } });
        // this.roomOverviewTour();
        this.localStorageData[this.localStorageFlag] = true;
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageData));
    }

    roomOverviewTour() {
        if (!this.whiteboardActive) {
            this.firebaseRefApp.update({
                whiteboardActive: true,
            });
        }
        this.initIntroJS();
        this.intro.addSteps([
            {
                element: document.querySelector('.aspect-ratio-constriction'),
                intro: `Display materials on the Whiteboard to engage students in therapeutic activities.`,
                position: 'top',
            },
            {
                element: document.querySelector('pl-local-stream pl-stream-video-action'),
                intro: `Click here to start your camera. Then click "allow" in the pop-up window to complete the connection.`,
                position: 'bottom',
            },
            {
                element: document.querySelector('pl-room-toolbar-button.room-link-button'),
                intro: `Invite clients to your therapy room by sharing this URL.`,
                position: 'bottom',
            },
            {
                element: document.querySelector('pl-room-toolbar-button.participants-button'),
                intro: `Manage access to your therapy room.`,
                position: 'bottom',
            },
            {
                element: document.querySelector('pl-room-toolbar-button.workspace-button'),
                intro: `Change the layout of the Workspace.`,
                position: 'bottom',
            },
            {
                element: document.querySelector('pl-room-toolbar-button.mouse-controls-button'),
                intro: `Manage your client's mouse actions.`,
                position: 'bottom',
            },
            {
                element: document.querySelector('pl-room-toolbar-button.whiteboard-button'),
                intro: `Access the Whiteboard to allow everyone to draw or add lines, text, shapes, and stamps to activities.`,
                position: 'bottom',
            },
            {
                element: document.querySelector('pl-room-toolbar-button.widgets-button'),
                intro: `Use dice, spinners, timers, and flashcards for games and other activities.`,
                position: 'bottom',
            },
            {
                element: document.querySelector('pl-room-toolbar-button.animations-button'),
                intro: `Reinforce positive behaviors and redirect students when needed.`,
                position: 'bottom',
            },
            {
                element: document.querySelector('pl-room-toolbar-button.overlays-button'),
                intro: `Apply a colored overlay to the Whiteboard and any open activities.`,
                position: 'bottom',
            },
            {
                element: document.querySelector('.right-toolbar #drawer-toggle'),
                intro: `Open and close the Activity Panel.`,
                position: 'left',
            },
            {
                element: document.querySelector('#activities-drawer-button'),
                intro: `Manage and display materials on the Whiteboard.`,
                position: 'left',
            },
            {
                element: document.querySelector('#games-drawer-button'),
                intro: `Select from a number of interactive games to play on the Workspace.`,
                position: 'left',
            },
            {
                element: document.querySelector('#teamwrite-drawer-button'),
                intro: `Write, edit, and collaborate on a shared document.`,
                position: 'left',
            },
            {
                element: document.querySelector('#cobrowse-drawer-button'),
                intro: `Access the internet with your student or share your documents and websites from your own computer.`,
                position: 'left',
            },
            {
                element: document.querySelector('#chat-drawer-button'),
                intro: `Initiate a chat with your students.`,
                position: 'left',
            },
            {
                element: document.querySelector('.help-drawer-btn'),
                intro: `Get help from a variety of resources. You can also restart the introduction tour from this menu.`,
                position: 'top',
            },
        ]);
        this.intro.onbeforechange((targetEle) => {
            if (!this.whiteboardActive) {
                this.firebaseRefApp.update({
                    whiteboardActive: true,
                });
            }
        });
        this.intro.start();
    }
}
