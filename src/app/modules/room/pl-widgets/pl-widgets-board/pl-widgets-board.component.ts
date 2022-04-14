import { Component, ElementRef, OnDestroy, OnInit, NgZone } from '@angular/core';
import { PLWidget } from '../pl-widget.model';
import { PLWidgetsBoardModelService } from './pl-widgets-board-model.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { PixelRatioService } from '../pl-spinner-widget/spinner/pixel-ratio.service';
@Component({
    selector: 'pl-widgets-board',
    templateUrl: './pl-widgets-board.component.html',
    styleUrls: ['./pl-widgets-board.component.less'],
})
export class PLWidgetsBoardComponent implements OnInit, OnDestroy {
    private readonly preloadImageList = [
        'dice/dice-background.png',
        'dice/dice-background-large.png',
    ];
    widgets: Array<PLWidget> = [];
    prevWidth = 0;
    prevHeight = 0;
    recalcDebounce;
    mediaChangedRef: Observable<BreakpointState>;

    constructor(private widgetsBoardModel: PLWidgetsBoardModelService,
                private element: ElementRef,
                private breakpointObserver: BreakpointObserver,
                private pixelRatioService: PixelRatioService,
                private zone: NgZone,) {
    }

    recalc = (first) => {
        this.zone.run(() => {
            const ret = this.widgetsBoardModel.recalcBoard(first, this.element.nativeElement, this.prevWidth, this.prevHeight);
            this.prevWidth = ret.prevWidth;
            this.prevHeight = ret.prevHeight;
        });
    }

    pixelRatioListener(result) {
        this.zone.run(() => {
            this.pixelRatioService.pixelRatioChanged();
        });
    }

    ngOnDestroy() {

    }

    ngOnInit() {
        this.preloadImages();
        this.widgets = this.widgetsBoardModel.getWidgets();
        this.widgetsBoardModel.setWidth(this.element.nativeElement.clientWidth);
        this.widgetsBoardModel.setHeight(this.element.nativeElement.clientHeight);
        setTimeout(() => {
            this.recalc(true);
        },         0);
        this.mediaChangedRef = this.breakpointObserver.observe([
            'screen and (min-resolution: 2dppx)',
        ]);

        this.mediaChangedRef.subscribe(result => {
            this.pixelRatioListener(result);
        });

    }

    onResize(evt) {
        clearTimeout(this.recalcDebounce);
        this.recalcDebounce = setTimeout(this.recalc, 300);
    }

    getId(index, item) {
        return item.$id;
    }

    private preloadImages() {
        this.preloadImageList.forEach((imgName) => {
            const img = new Image();
            img.src = `/assets/widgets/${imgName}`;
        });
    }

}
