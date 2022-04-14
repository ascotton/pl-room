import { Component, Input, ViewEncapsulation, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { PLExpansionPanelComponent } from '@common/components';
import { HomeworkService } from './homework.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pl-homework-drawer',
    templateUrl: 'pl-homework-drawer.component.html',
    styleUrls: ['pl-homework-drawer.component.less'],
    encapsulation: ViewEncapsulation.None,
})

export class PLHomeworkDrawerComponent implements OnInit, OnDestroy, AfterViewInit {
    subscription: Subscription;
    loading = false;

    @Input() active: boolean;

    @ViewChild('permissionPanel') permissionPanel: PLExpansionPanelComponent;

    constructor(
        private homeworkService: HomeworkService,
    ) { }

    ngOnInit(): void {
        this.subscription = this.homeworkService.loading$.subscribe((loading) => {
            this.loading = loading;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngAfterViewInit() {
        this.permissionPanel.open();
    }

    refresh() {
        this.homeworkService.refresh();
    }
}
