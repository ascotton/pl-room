import { Component, OnInit } from '@angular/core';
import { HomeworkService } from '../homework.service';
import { Student } from '../student.model';
import { PLHomeworkFrameComponent } from '../pl-homework-frame/pl-homework-frame.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'pl-students-w-permission',
    templateUrl: 'pl-students-w-permission.component.html',
    styleUrls: ['pl-students-w-permission.component.less'],
})

export class PLStudentsWPermissionComponent implements OnInit {
    get students$() {
        return this.homeworkService.studentsWithPermission$;
    }

    constructor(
        private homeworkService: HomeworkService,
        private dialog: MatDialog,
    ) { }

    ngOnInit() { }

    studentSelected(student: Student) {
        this.dialog.open(PLHomeworkFrameComponent, {
            panelClass: 'spacing-0',
            width: '60%',
            minWidth: 800,
            maxWidth: 1400,
            data: {
                student,
            },
        });
    }
}
