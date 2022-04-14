import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { ResizeObserverService } from '@common/services-ng2';
import { LayoutMode, selectLayoutMode } from '@room/app/store';
import { selectConferenceStreamsInSession } from '../../store';
import { StreamBoxService } from './stream-box.service';
@Component({
    selector: 'pl-stream-box',
    templateUrl: 'stream-box.component.html',
    styleUrls: ['stream-box.component.less'],
    providers: [
        StreamBoxService,
        ResizeObserverService,
    ],
    encapsulation: ViewEncapsulation.None,
})

export class StreamBoxComponent implements OnInit, OnDestroy {
    @ViewChild('toolbar') toolbar: ElementRef;
    public isPromoted$: Observable<boolean>;
    public styles$: Observable<any>;
    public layoutMode$: Observable<LayoutMode>;

    constructor(
        private streamBoxService: StreamBoxService,
        private store: Store<AppState>,
        private resizeObserverService: ResizeObserverService,
    ) {
    }

    ngOnInit() {
        this.isPromoted$ = this.streamBoxService.isPromoted$;
        this.layoutMode$ = this.store.select(selectLayoutMode);
        const streams$ = this.store.select(selectConferenceStreamsInSession);
        const element = document.getElementsByClassName('conference')[0];
        this.styles$ = combineLatest([
            streams$,
            this.streamBoxService.id$,
            this.layoutMode$,
            this.resizeObserverService.observe(element),
        ]).pipe(
            map(([streams, id, layoutMode, entry]) => {
                const width = entry.contentRect.width;
                const height = entry.contentRect.height;
                const currentStream = streams.find(stream => stream.id === id);
                const leftDrawerSize = 212;
                const toolbarHeight = 58;
                if (!currentStream || !currentStream.isPromoted || layoutMode === LayoutMode.compact) {
                    const compactToolbarHeight = this.toolbar.nativeElement.childElementCount > 0 ? toolbarHeight : 0;
                    return {
                        width: `${leftDrawerSize}px`,
                        height: `${0.75 * leftDrawerSize + compactToolbarHeight}px`,
                    };
                }
                const promotedStreams = streams.filter(s => s.isPromoted);
                const allPromoted = promotedStreams.length === streams.length;
                const count = promotedStreams.length;
                const numCols = Math.ceil(Math.sqrt(count));
                const numRows = Math.ceil(count / numCols);
                const leftMargin = allPromoted ? 0 : leftDrawerSize;
                const fullWidth = width - leftMargin;
                const fullHeight = height;
                let boxWidth = 0.95 * fullWidth / numCols;
                let boxHeight = 0.75 * boxWidth + toolbarHeight;

                if (boxHeight * numRows > fullHeight) {
                    boxHeight = 0.95 * fullHeight / numRows;
                    boxWidth = 1.33 * (boxHeight - toolbarHeight);
                }

                const xMargin = (fullWidth - boxWidth * numCols) / 2;
                const yMargin = (fullHeight - boxHeight * numRows) / 2;

                const boxMargin = 25;
                const index = promotedStreams.indexOf(currentStream);
                const styles: any = {};

                const currentColumn = (index % numCols);
                const currentRow = Math.floor(index / numCols);

                let locY = yMargin;
                let locX = xMargin + leftMargin;
                locX += boxWidth * currentColumn;
                locY += boxHeight * currentRow;

                styles.maxHeight = '100%';
                styles.maxWidth = '100%';
                styles.position = 'absolute';
                styles.top = `${locY}px`;
                styles.left = `${locX}px`;
                styles.width = `${boxWidth - boxMargin}px`;
                styles.height = `${boxHeight - boxMargin}px`;

                return styles;
            }),
        );
    }

    ngOnDestroy() {
        this.resizeObserverService.disconnect();
    }
}
