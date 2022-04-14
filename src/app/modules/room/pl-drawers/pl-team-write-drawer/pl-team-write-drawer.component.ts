import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppStore } from '@app/appstore.model';

import { AngularCommunicatorService } from '@app/downgrade/angular-communicator.service';

import { AppModel } from '@common/models/app-model.service';
import { FirebaseAppModel } from '@common/models/firebase/firebase-app-model.service';
import { FirebaseModel } from '@common/models/firebase/FirebaseModel';

@Component({
    selector: 'pl-team-write-drawer',
    templateUrl: './pl-team-write-drawer.component.html',
    styleUrls: ['./pl-team-write-drawer.component.less'],
})
export class PLTeamWriteDrawerComponent  implements OnInit, OnChanges {
    @Input() active = false;
    teamWriteActive: boolean;
    teamWriteReady = false;
    documentsRef: any;
    currentDocumentRef: any;
    documents = [];
    currentDocument: any;

    _showDocuments = false;
    _showTrashedDocuments = false;
    readonly showDocumentsLocalStorageKey = 'pl-team-write-show-documents';
    readonly showTrashedDocumentsLocalStorageKey = 'pl-team-write-show-trashed-documents';
    addNewHovering = false;
    loadingDocumentKey: any;
    loadWaiter: NodeJS.Timeout;



    constructor(
        private appModel: AppModel,
        private firebaseAppModel: FirebaseAppModel,
        private firebaseModel: FirebaseModel,
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
                            this.teamWriteActive = payload.teamWriteActive;
                            return;
                }
            },
        );
        this.store.select('teamWriteStore').subscribe(
            (data: any) => {
                if (!data) {
                    return;
                }
                const type = data.type;
                const payload = data.payload;
                switch (type) {
                        case 'TEAM_WRITE_DOC_LOADED':
                            if (this.loadingDocumentKey === payload.key) {
                                this.loadingDocumentKey = null;
                            }
                            return;
                        case 'TEAM_WRITE_READY':
                            this.teamWriteReady = true;
                            return;
                }
            },
        );
    }

    ngOnInit() {
        this.initDocuments();
        this._showDocuments = localStorage.getItem(this.showDocumentsLocalStorageKey) === 'true';
    }

    ngOnChanges(event) {
        if (this.active && ! this.teamWriteActive) {
            this.start();
        }

    }

    get showDocuments() {
        return this._showDocuments;
    }

    set showDocuments(val) {
        this._showDocuments = val;
        localStorage.setItem(this.showDocumentsLocalStorageKey, val ? 'true' : 'false');
    }

    get showTrashedDocuments() {
        return this._showTrashedDocuments;
    }

    set showTrashedDocuments(val) {
        this._showTrashedDocuments = val;
        localStorage.setItem(this.showTrashedDocumentsLocalStorageKey, val ? 'true' : 'false');
    }

    showDocumentsClicked = () => {
        this.showDocuments = !this.showDocuments;
    }

    showTrashedDocumentsClicked = () => {
        this.showTrashedDocuments = !this.showTrashedDocuments;
    }

    initDocuments = () => {
        this.documentsRef = this.firebaseModel.getFirebaseRef('teamWrite/documents');
        this.currentDocumentRef = this.firebaseModel.getFirebaseRef('teamWrite/currentDocument');

        this.documentsRef.on('value', (snapshot)  => {
            this.documents = [];
            snapshot.forEach(
                (childSnapshot) => {
                    const nextVal = childSnapshot.val();
                    const nextDoc = {
                        key: childSnapshot.key,
                        created: nextVal.created,
                        modified: nextVal.modified,
                        name: nextVal.name,
                        trashed: nextVal.trashed,
                    };
                    this.documents.push(nextDoc);
                });
            this.documents = this.documents.sort((a, b) => {
                return b.modified - a.modified;
            });
            if (this.currentDocument) {
                this.updateCurrent();
            }
        });

        this.currentDocumentRef.on('value', (snapshot)  => {
            const update = snapshot.val();
            if (update && update.key) {
                this.documentsRef.child(update.key).once(
                    'value',
                    (docSnap)  => {
                        this.currentDocument = docSnap.val();
                        this.currentDocument.key = snapshot.val().key;
                        this.updateCurrent();
                    }
                );
            }
        });
    }

    private updateCurrent() {
        this.documents = this.documents.map((doc) => {
            doc.current = doc.key === this.currentDocument.key;
            return doc;
        });
    }

    start() {
        this.appModel.toggleTeamWrite(true);
        this.teamWriteActive = true;
    }

    exit() {
        this.appModel.toggleTeamWrite(false);
        this.teamWriteActive = false;
    }

    reset() {
        this.store.dispatch({ type: 'RESET_TEAM_WRITE_DOC', payload: { } });
    }

    save() {
        this.store.dispatch({ type: 'SAVE_TEAM_WRITE_DOC', payload: { } });
    }

    new() {
        this.start();
        this.showDocuments = true;
        this.store.dispatch({ type: 'NEW_TEAM_WRITE_DOC', payload: { } });
    }

    loadDocument({ key, name }) {
        if (this.loadingDocumentKey) {
            return;
        }
        this.start();
        this.loadingDocumentKey = key;
        this.store.dispatch({ type: 'LOAD_TEAM_WRITE_DOC', payload: { key } });

        if (this.loadWaiter) {
            clearTimeout(this.loadWaiter);
        }
        this.loadWaiter = setTimeout(() => {
            this.loadingDocumentKey = null;
        }, 10 * 1000);
    }

    deleteDocument(key) {
        this.store.dispatch({ type: 'DELETE_TEAM_WRITE_DOC', payload: { key } });
    }

    trashDocument(key) {
        this.store.dispatch({ type: 'TRASH_TEAM_WRITE_DOC', payload: { key } });
    }

    restoreDocument(key) {
        this.store.dispatch({ type: 'RESTORE_TEAM_WRITE_DOC', payload: { key } });
    }

    nameChanged(doc) {
        if (doc.key === this.currentDocument.key) {
            this.currentDocument.name = doc.name;
        }
        this.documentsRef.child(doc.key).update({ name: doc.name });
    }
}
