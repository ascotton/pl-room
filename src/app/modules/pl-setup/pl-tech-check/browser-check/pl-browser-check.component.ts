import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PLMultiLanguageService } from '../../pl-multi-lang.service';
import { PLTechCheckService } from '../pl-tech-check.service';

@Component({
    selector: 'pl-browser-check',
    templateUrl: 'pl-browser-check.component.html',
    styleUrls: ['./pl-browser-check.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLBrowserCheckComponent implements OnInit, OnDestroy {
    @ViewChild('setupLink') setupLink: ElementRef;
    @Input() public code: string;
    codeValidated = false;
    validCode = false;
    private subscriptions: Subscription[] = [];

    constructor(private techCheckService: PLTechCheckService, private multiLangService: PLMultiLanguageService) { }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    ngOnInit() {
        if (this.code) {
            this.onValidateCode();
        }
    }

    onStart() {
        this.techCheckService.startTechCheck(this.validCode ? this.code : null);
    }

    onValidateCode() {
        if (this.code) {
            this.subscriptions.push(
                this.techCheckService.validateCode(this.code).subscribe((res) => {
                    this.codeValidated = true;
                    this.validCode = !!res;
                }),
            );
        } else {
            this.codeValidated = false;
            this.validCode = false;
        }
    }

    onCopyURL() {
        const range = document.createRange();
        window.getSelection().removeAllRanges();
        range.selectNode(this.setupLink.nativeElement);
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    }

    isMultiLangEnabled = () => this.multiLangService.isMultiLangEnabled;

    onSwitchLang() {
        const currentLang = this.multiLangService.getCurrentLang();
        if (currentLang === 'en') {
            this.multiLangService.setCurrentLang('es');
        } else {
            this.multiLangService.setCurrentLang('en');
        }
    }

    get isCompatibleBrowser() {
        return this.techCheckService.isCompatibleBrowser();
    }

}
