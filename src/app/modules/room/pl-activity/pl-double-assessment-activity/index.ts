import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLDoubleAssessmentActivityDirective } from './pl-double-assessment-activity.directive';

const components = [
    PLDoubleAssessmentActivityDirective,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [...components],
    declarations: [...components],
    providers: [],
})
export class PLDoubleAssessmentActivityModule { }

export {
    PLDoubleAssessmentActivityDirective,
};
