import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLYoutubeActivityDirective } from './pl-youtube-activity.directive';

const components = [
    PLYoutubeActivityDirective,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [...components],
    declarations: [...components],
    providers: [],
})
export class PLYoutubeActivityModule { }

export {
    PLYoutubeActivityDirective,
};
