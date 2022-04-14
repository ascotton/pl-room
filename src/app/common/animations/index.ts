import { NgModule } from '@angular/core';
import { PLSlideDownDirective } from './slide-down.directive';

@NgModule({
    imports: [],
    exports: [PLSlideDownDirective],
    declarations: [PLSlideDownDirective],
    providers: [],
})
export class CommonAnimationsModule { }

export {
    PLSlideDownDirective,
};
