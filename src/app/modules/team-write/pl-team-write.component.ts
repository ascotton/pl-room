declare var CodeMirror: any;

import * as Firepad from 'firepad';
import { Observable } from 'rxjs';
import { selectClientClickMuted } from '../room/app/store';

class PlTeamWriteController {
    static $inject = [
        '$scope', '$timeout', 'currentUserModel', 'firebaseModel', 'firebaseAppModel', 'ngrxStoreService',
    ];
    firepadStarted = false;
    codeMirror: any;
    firepad: any;
    firepadRef: any;
    documentsRef: any;
    readonly tabMap = { Tab: false, 'Shift-Tab': false };
    showClearConfirm: boolean;
    initing: boolean;
    handlingRemoved: any;

    docIndex = 0;

    documentsInitialized = false;
    currentDocumentRef: any;
    currentDocumentKey: any;
    currentDocument: { name: any; html: any; created: number; modified: number; };
    historyRef: any;
    unsavedChanges: boolean;
    loadQueuedKey: any;
    loading: boolean;
    newTeamWriteDocQueued: boolean;
    isObserver: boolean;

    constructor(scope, private $timeout, private currentUserModel, private firebaseModel, firebaseAppModel,
                private ngrxStoreService) {
        this.isObserver = currentUserModel.user.isInGroup('Observer');
        scope.isObserver = this.isObserver;
        // Initialize firepad the first time Team Write is activated
        scope.$watch(
            () => firebaseAppModel.app.teamWriteActive,
            (val) => {
                $timeout(() => {
                    scope.teamWriteActive = val;
                });
                if (val) {
                    if (!this.firepadStarted) {
                        this.initFirepad();
                    }
                }
            },
        );

        ngrxStoreService.select('teamWriteStore').subscribe(
            (data: any) => {
                if (!data) {
                    return;
                }
                const type = data.type;
                const payload = data.payload;
                switch (type) {
                        case 'RESET_TEAM_WRITE_DOC':
                            this.reset();
                            return;
                        case 'SAVE_TEAM_WRITE_DOC':
                            this.saveDocument();
                            return;
                        case 'NEW_TEAM_WRITE_DOC':
                            this.newTeamWriteDoc();
                            return;
                        case 'LOAD_TEAM_WRITE_DOC':
                            setTimeout(() => {
                                this.loadDocument(payload.key);
                            });
                            return;
                        case 'DELETE_TEAM_WRITE_DOC':
                            this.deleteDocument(payload.key);
                            return;
                        case 'TRASH_TEAM_WRITE_DOC':
                            this.trashDocument(payload.key);
                            return;
                        case 'RESTORE_TEAM_WRITE_DOC':
                            this.restoreDocument(payload.key);
                            return;
                }
            },
        );

        // if the mouse becomes muted or unmuted and the user is a student, we
        // shutdown or re-enable editability of Team Write. (It is always shut
        // down for Observers, never shut down for Therapists.)
        ngrxStoreService.select(selectClientClickMuted).subscribe((isMuted) => {
            if (!this.codeMirror) {
                return;
            }
            if (currentUserModel.user.isInGroup('Student')) {
                if (isMuted) {
                    this.codeMirror.setOption('readOnly', 'nocursor');
                    this.codeMirror.addKeyMap(this.tabMap);
                } else {
                    this.codeMirror.setOption('readOnly', false);
                    this.codeMirror.removeKeyMap(this.tabMap);
                }
            }
        });
        this.initCodemirror();
    }

    initDocuments = () => {
        this.documentsRef = this.firebaseModel.getFirebaseRef('teamWrite/documents');
        this.currentDocumentRef = this.firebaseModel.getFirebaseRef('teamWrite/currentDocument');
        this.historyRef = this.firebaseModel.getFirebaseRef('groupDoc/history');

        this.documentsRef.once('value', (snapshot)  => {
            if (snapshot.numChildren() === 0 && this.currentUserModel.user.isClinicianOrExternalProvider()) {
                const key = this.newTeamWriteDoc('', this.firepad.getHtml());
            }
        });

        this.currentDocumentRef.on('value', (snapshot)  => {
            const val = snapshot.val();
            if (val && (this.currentUserModel.user.isClinicianOrExternalProvider())) {
                this.currentDocKeyUpdated(snapshot.val().key);
            }
        });

        this.historyRef.on('value', (snapshot) => {
            this.unsavedChanges = true;
        });
        this.documentsInitialized = true;
        setInterval(
            () => {
                if (this.unsavedChanges) {
                    this.saveDocument().subscribe();
                }
            },
            5000);
    }

    currentDocKeyUpdated(key) {
        this.documentsRef.child(key).once(
            'value',
            (docSnap)  => {
                const document = docSnap.val();
                this.setCurrentDoc(key, document);
            }
        );
    }

    setCurrentDoc(key, doc) {
        this.currentDocumentKey = key;
        this.currentDocument = doc;
        setTimeout(() => {
            this.firepad.setHtml('');
            // this.firepadRef.child('history').remove();
            this.firepad.setHtml(doc.html);
            this.ngrxStoreService.dispatch({ type: 'TEAM_WRITE_DOC_LOADED', payload: { key } });
            if (this.loadQueuedKey) {
                this.loadDocument(this.loadQueuedKey);
                this.loadQueuedKey = null;
            } else if (this.newTeamWriteDocQueued) {
                this.newTeamWriteDoc();
                this.newTeamWriteDocQueued = false;
            }
        });
    }

    createDocument(name, html) {
        const time = new Date().getTime();
        const document = {
            name,
            html,
            created: time,
            modified: time,
        };
        return document;
    }

    newTeamWriteDoc = (name = '', html = '') => {
        if (this.loading) {
            this.newTeamWriteDocQueued = true;
            return;
        }
        const document = this.createDocument(name, html);
        const key = this.documentsRef.push(document).key;
        this.currentDocumentRef.update({ key });
        this.setCurrentDoc(key, document);
    }

    loadDocument(key) {
        if (this.loading) {
            this.loadQueuedKey = key;
            return;
        }
        this.loading = true;
        this.saveDocument().subscribe(() => {
            this.currentDocumentRef.update(
                { key },
                (error) => {
                    this.loading = false;
                    const updateTime = new Date().getTime();
                    if (error) {
                        console.debug('loadDocument error: ', error);
                    } else {
                        // scheduled post load activities should be handled in setCurrentDoc
                    }
                }
            );
        })
    }

    trashDocument(key) {
        this.documentsRef.child(key).update({ trashed: new Date().getTime() });
    }

    restoreDocument(key) {
        this.documentsRef.child(key).update({ trashed: 0 });
    }

    saveDocument() {
        return new Observable((observer: any) => {
            const newHtml = this.firepad.getHtml();
            if (!this.currentDocument) {
                this.unsavedChanges = false;
                observer.next();
                return;
            }
            const currHtml = this.currentDocument.html;
            // only save if the html is actually different.
            // try checking for a length difference first, before a full string comparison
            if (newHtml.length !== currHtml.length || newHtml !== currHtml) {
                this.currentDocument.html = newHtml;
                this.currentDocument.modified = new Date().getTime();
                this.documentsRef.child(this.currentDocumentKey).update(
                    {
                        html: this.currentDocument.html,
                        modified: this.currentDocument.modified,
                    },
                    (error) => {
                        if (error) {
                            observer.next();
                        } else {
                            this.unsavedChanges = false;
                            observer.next();
                        }
                    }
                );
            } else {
                this.unsavedChanges = false;
                observer.next();
            }
        });
    }

    deleteDocument(key) {
        this.documentsRef.child(key).remove();
    }

    reset = () => {
        this.showClearConfirm = true;
    }

    confirmClear = () => {
        this.actuallyReset();
        this.showClearConfirm = false;
    };

    closeConfirm = () => {
        this.showClearConfirm = false;
    };

    private actuallyReset = () => {
        this.firepad.setHtml('');
        this.firepadRef.remove();
    }

    private initFirepad(initHtml?: string) {
        const start = new Date().getTime();
        if (this.initing) {
            return;
        }
        this.initing = true;
        this.firepadStarted = true;
        this.initCodemirror();

        this.firepadRef = this.firebaseModel.getFirebaseRef('groupDoc');
        this.firepad = Firepad.fromCodeMirror(
            this.firepadRef,
            this.codeMirror,
            { richTextToolbar: !this.isObserver, richTextShortcuts: true,
                imageInsertionUI: this.currentUserModel.user.isClinicianOrExternalProvider(),
                userDisplayName: this.currentUserModel.user.getFirstNameLastInitial(),
                showPrint: this.currentUserModel.user.isClinicianOrExternalProvider() });
        this.firepadRef.on('child_removed', (data) => {
            // this.handleRemoved();
        });
        this.firepad.on('ready', () => {
            console.log('firepad ready time: ', (new Date().getTime() - start) , 's');
            this.initing = false;
            this.ngrxStoreService.dispatch({ type: 'TEAM_WRITE_READY', payload: { } });
            if (this.firepad.isHistoryEmpty()) {
                this.firepad.setHtml(initHtml ? initHtml : '');
            }
            if (!this.documentsInitialized) {
                this.initDocuments();
            }
        });
    }

    private initCodemirror() {
        if (this.codeMirror) {
            return;
        }

        // if the user is Observer, we need to suppress any ability to enter or edit Team Write
        // The 'embargo' layer stops clicks, but still allows you to tab into the editor. Setting
        // readOnly to 'noCursor' is supposed to prevent cursor focus in addition to preventing
        // editing. However, for unclear reasons you can still not only tab into the editor but
        // then also you can insert tabs, even though other typing is supressed. As a last resort
        // we tell CodeMirror to ignore the Tab key if the user is an observer via the extraKeys
        // config value.
        if (this.isObserver) {
            this.codeMirror = CodeMirror(
                document.getElementById('firepad-container'),
                { lineWrapping: true, readOnly: 'nocursor',
                    extraKeys: this.tabMap });
        } else {
            this.codeMirror = CodeMirror(
                document.getElementById('firepad-container'),
                { lineWrapping: true, userId: this.currentUserModel.user.uuid,
                    autofocus: true,
                    userDisplayName: this.currentUserModel.user.getFirstNameLastInitial() });
        }
    }

    private handleRemoved() {
        if (this.handlingRemoved) {
            return;
        }
        this.handlingRemoved = true;
        this.$timeout(() => {
            this.firepad.dispose();
            this.$timeout(() => {
                this.initFirepad();
                this.handlingRemoved = false;
            });
        });
    }
}

import { teamWriteModule } from './team-write.module';

const teamWriteComponent = teamWriteModule.component('plTeamWrite', {
    template: require('./pl-team-write.component.html'),
    bindings: {
    },
    controller: PlTeamWriteController,
});
