import { Component, OnInit } from '@angular/core';
import { HomeworkService } from '../homework.service';
import { map } from 'rxjs/operators';
import { PLUrlsService } from '@root/src/lib-components';
import { Observable } from 'rxjs';
import { Student } from '../student.model';

@Component({
    selector: 'pl-students-wo-permission',
    templateUrl: 'pl-students-wo-permission.component.html',
    styleUrls: ['pl-students-wo-permission.component.less'],
})

export class PLStudentsWOPermissionComponent implements OnInit {
    readonly students$: Observable<(Student & { profile_link: string })[]>;

    constructor(
        private homeworkService: HomeworkService,
        private plUrls: PLUrlsService,
    ) {
        this.students$ = this.homeworkService.studentsWithoutPermission$.pipe(
            map(students => students.map(student => ({
                ...student,
                profile_link: `${this.plUrls.urls['eduClientsFE']}/client/${student.uuid}/details`,
            }))),
        );
    }

    ngOnInit() {
    }
}
