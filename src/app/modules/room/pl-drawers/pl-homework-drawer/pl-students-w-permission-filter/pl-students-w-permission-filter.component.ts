import { Component, OnInit } from '@angular/core';
import { HomeworkService } from '../homework.service';

@Component({
    selector: 'pl-students-w-permission-filter',
    templateUrl: 'pl-students-w-permission-filter.component.html',
    styleUrls: ['pl-students-w-permission-filter.component.less'],
})

export class PLStudentsWPermissionFilterComponent implements OnInit {
    filter = '';
    constructor(
        private homeworkService: HomeworkService,
    ) { }

    ngOnInit() { }

    filterChanged() {
        this.homeworkService.filter(this.filter);
    }
}
