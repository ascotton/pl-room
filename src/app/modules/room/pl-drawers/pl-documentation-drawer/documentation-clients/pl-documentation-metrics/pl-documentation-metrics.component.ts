import { Component, Input, Output, EventEmitter } from '@angular/core';

import {
    PLGraphQLService,
    PLHttpService,
    PLLodashService,
    PLUrlsService,
} from '@root/index';

import {
    PLRecordRoomService,
} from '@common/services-ng2/pl-records';

@Component({
    selector: 'pl-documentation-metrics',
    templateUrl: './pl-documentation-metrics.component.html',
    styleUrls: ['./pl-documentation-metrics.component.less']
})
export class PLDocumentationMetricsComponent {
    @Input() clientServiceId: string = '';
    @Input() clientId: string = '';
    @Input() record: any = {};
    @Input() providerUserId: string = '';
    @Input() event: any = {};
    @Input() instanceId: string = '';
    @Input() metrics: any[] = [];

    @Output() onMetricsUpdated = new EventEmitter<any>();
    @Output() refreshMetrics = new EventEmitter<any>();

    urls: any = {};
    metricPoints: any[] = [];
    selectedMetricPointsIds: string[] = [];
    selectOptsMetricPoints: any[] = [];
    loading: boolean = true;

    // One per client appointment, so will set later once have instance id.
    localStorageKey: string = '';
    localStorageData: any = {};

    constructor(
        private plGraphQL: PLGraphQLService,
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plUrls: PLUrlsService,
        private plRecordRoom: PLRecordRoomService,
    ) {}

    ngOnInit() {
        this.urls = this.plUrls.urls;
    }

    ngOnChanges() {
        this.loadMetrics();
        if (this.instanceId) {
            this.localStorageKey = `documentationMetrics${this.instanceId}`;
        }
    }

    loadLocalStorage() {
        if (this.localStorageKey) {
            // Load state from local storage and pre-select if necessary.
            let data: any;
            try {
                data = localStorage.getItem(this.localStorageKey);
            } catch (e) {
                console.debug('localStorage error in PLDocumentationMetricsComponent');
            }
            if (data) {
                data = JSON.parse(data);
                if (data.selectedMetricPointsIds) {
                    // Could just set them directly, but in case a metric was removed, check
                    // that it still exists first.
                    const selectedIds = [];
                    data.selectedMetricPointsIds.forEach((id: string) => {
                        let index = this.plLodash.findIndex(this.selectOptsMetricPoints, 'value', id);
                        if (index > -1) {
                            selectedIds.push(id);
                            this.selectOptsMetricPoints[index].xSelected = true;
                        }
                    });
                    this.selectedMetricPointsIds = selectedIds;
                    this.selectMetricPoints();
                }
            }
        }
    }

    onMetricPointUpdated() {
        this.onMetricsUpdated.emit({});
    }

    // on changes is not firing on record uuid update, so loop here to wait for it
    // to load.
    loadMetrics() {
        if (this.clientServiceId && this.record.uuid) {
            this.getMetrics();
        } else {
            setTimeout(() => {
                this.loadMetrics();
            }, 500);
        }
    }

    reGetMetrics() {
        this.refreshMetrics.emit({});
    }

    getMetrics() {
        this.loading = true;
        this.plRecordRoom.getMetrics(this.clientServiceId, this.record.uuid, this.metrics)
            .subscribe((res: any) => {
                const opts: any[] = [];
                let atLeastOneTrial = false;
                res.metricPoints.forEach((metricPoint: any) => {
                    metricPoint.xSelected = false;
                    opts.push({ value: metricPoint.metric.id, label: metricPoint.metric.name });
                    if (metricPoint.trials > 0) {
                        atLeastOneTrial = true;
                    }
                });
                this.metricPoints = res.metricPoints;
                this.selectOptsMetricPoints = opts;
                this.loadLocalStorage();
                // Even if not new, on first load if any any metrics, want to allow importing them.
                if (atLeastOneTrial) {
                    this.onMetricsUpdated.emit({});
                }
                this.loading = false;
            });
    }

    selectMetricPoints() {
        // Not getting updated values immediately so need timeout.
        setTimeout(() => {
            this.metricPoints.forEach((metricPoint: any) => {
                if (this.selectedMetricPointsIds.includes(metricPoint.metric.id)) {
                    metricPoint.xSelected = true;
                } else {
                    metricPoint.xSelected = false;
                }
            });
            // Update local storage.
            this.localStorageData.selectedMetricPointsIds = this.selectedMetricPointsIds;
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageData));
        }, 0);
    }

    isEditable() {
        return this.record && !this.record.signed;
    }
}
