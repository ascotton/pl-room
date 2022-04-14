import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'pl-loader-overlay',
    templateUrl: 'pl-loader-overlay.component.html',
    styleUrls: ['./pl-loader-overlay.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLLoaderOverlayComponent {
    @Input() loadingLabel: string;
    @Input() isLoading = false;

}
