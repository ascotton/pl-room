import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLMemoryActivityDirective } from './pl-memory-activity.directive';

const components = [
    PLMemoryActivityDirective,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [...components],
    declarations: [...components],
    providers: [],
})
export class PLMemoryActivityModule { }

export {
    PLMemoryActivityDirective,
};
