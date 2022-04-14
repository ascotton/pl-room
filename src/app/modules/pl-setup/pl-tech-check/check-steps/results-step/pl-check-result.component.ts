import { Component, Input, OnInit } from '@angular/core';
import { StepResult } from './pl-results-step.component';
@Component({
    selector: 'pl-check-result',
    templateUrl: 'pl-check-result.component.html',
    styleUrls: ['./pl-check-result.component.less'],
})
export class PLCheckResultComponent implements OnInit {
    @Input() public icon: string;
    @Input() public result: StepResult;
    @Input() public checkName: string;
    stepResult = StepResult;

    constructor() { }

    ngOnInit() {

    }

}
