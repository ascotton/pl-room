import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLWjAudioAssessmentDirective } from './pl-wj-audio-assessment.directive';

const components = [
    PLWjAudioAssessmentDirective,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [...components],
    declarations: [...components],
    providers: [],
})
export class PLWjAudioAssessmentModule { }

export {
    PLWjAudioAssessmentDirective,
};
