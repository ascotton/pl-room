import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLPDFActivityDirective } from './pl-pdf-activity.directive';

const components = [
    PLPDFActivityDirective,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [...components],
    declarations: [...components],
    providers: [],
})
export class PLPDFActivityModule { }

export {
    PLPDFActivityDirective,
};
