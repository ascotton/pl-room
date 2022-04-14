import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { PLMultiLanguageService } from '../../../pl-multi-lang.service';

@Component({
    selector: 'pl-lang-select-card',
    templateUrl: 'pl-lang-select-card.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class PLLangSelectCardComponent implements OnDestroy {

    selectedLang: string;
    private langChangeSub: Subscription;

    constructor(private langService: PLMultiLanguageService) {
        this.langChangeSub = this.langService.langChanged$.subscribe((lang) => {
            this.selectedLang = lang;
        });
        this.selectedLang = this.langService.getCurrentLang();
    }

    ngOnDestroy() {
        this.langChangeSub.unsubscribe();
    }

    onLangChanged(ev: MatSelectChange) {
        this.selectedLang = ev.value;
        this.langService.setCurrentLang(ev.value);
    }

    get languageList() {
        return this.langService.languages;
    }

}
