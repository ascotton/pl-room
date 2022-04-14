import { 
    Component, Input, OnInit, OnChanges, Output, EventEmitter, Renderer2, ViewChild, ElementRef, OnDestroy,
} from '@angular/core';

import * as moment from 'moment';

@Component({
    selector: 'pl-document-item',
    templateUrl: './pl-document-item.component.html',
    styleUrls: ['./pl-document-item.component.less'],
})
export class PLDocumentItemComponent  implements OnInit, OnChanges, OnDestroy {
    @Input() document: any = {};
    @Input() itemDisabled: any = {};
    @Input() allowDeleteCurrent = false;
    @Output() loadDocument = new EventEmitter<any>();
    @Output() deleteDocument = new EventEmitter<string>();
    @Output() trashDocument = new EventEmitter<string>();
    @Output() restoreDocument = new EventEmitter<string>();
    @Output() nameChanged = new EventEmitter<string>();
    @ViewChild('docNameEditor', { static: false }) docNameEditor: ElementRef;

    dropdownVisible = false;
    clickListener: () => void;
    editingName: boolean;

    dateInterval: any = null;

    constructor(private renderer: Renderer2, private element: ElementRef) {
    }

    ngOnInit() {
        this.updateDate();
        const updateDateSeconds = this.document.current ? 5 : 60;
        this.dateInterval = setInterval(() => {
            this.updateDate();
        }, updateDateSeconds * 1000);
    }

    ngOnChanges(event) {
    }

    ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
        if (this.dateInterval) {
            window.clearInterval(this.dateInterval);
        }
    }

    onLoadDocument(event) {
        if (this.itemDisabled || this.document.trashed || this.document.current) {
            return;
        } else {
            this.loadDocument.emit({ key: this.document.key, name: this.document.name});
        }
    }

    onEnter(event) {
        this.document.name = event.target.value;
        this.editingName = false;
        this.nameChanged.emit(this.document);
    }

    onDeleteDocument() {
        setTimeout(() => {
            this.deleteDocument.emit(this.document.key);
        });
    }

    onTrashDocument() {
        this.trashDocument.emit(this.document.key);
    }

    onRestoreDocument() {
        this.restoreDocument.emit(this.document.key);
    }

    updateDate() {
        if (this.document && this.document.modified) {
            this.document.date = moment(this.document.modified).fromNow();
        }
    }

    startRename() {
        this.editingName = true;
        setTimeout(() => {
            this.docNameEditor.nativeElement.focus();
        });
    }

    showDropdown() {
        setTimeout(() => {
            this.dropdownVisible = true;
        });
        this.clickListener = this.renderer.listen('body', 'click', () => {
            if (this.dropdownVisible) {
                this.hideDropdown();
            }
        });
    }
    hideDropdown() {
        this.dropdownVisible = false;
        this.clickListener();
    }
}
