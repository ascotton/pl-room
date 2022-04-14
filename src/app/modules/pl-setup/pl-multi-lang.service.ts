import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PLMultiLanguageService {
    private langChangedSource = new BehaviorSubject<string>(null);
    langChanged$ = this.langChangedSource.asObservable();
    private currentLang: string;
    readonly languages: string[] = ['en', 'es'];
    private readonly multiLangEnabled = true;

    constructor(private translate: TranslateService) {
        const currentLang = translate.currentLang || translate.defaultLang;
        const langObj = this.languages.find(l => l === currentLang);
        this.currentLang = langObj || this.languages[0];
    }

    getCurrentLang() {
        return this.currentLang;
    }

    setCurrentLang(lang: string) {
        this.currentLang = lang;
        this.translate.use(lang);
        this.langChangedSource.next(lang);
    }

    translateKey = key => this.translate.instant(key);

    get isMultiLangEnabled() {
        return this.multiLangEnabled;
    }
}
