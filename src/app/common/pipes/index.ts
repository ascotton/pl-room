import { NgModule } from '@angular/core';
import { TimeFormatterPipe } from './time-formatter.pipe';

@NgModule({
    imports: [],
    exports: [
        TimeFormatterPipe,
    ],
    declarations: [
        TimeFormatterPipe,
    ],
    providers: [],
})
export class PLCommonPipesModule { }

export {
    TimeFormatterPipe,
}
