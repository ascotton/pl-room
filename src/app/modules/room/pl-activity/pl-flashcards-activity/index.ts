import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLFlashcardsActivityDirective } from './pl-flashcards-activity.directive';

const components = [
    PLFlashcardsActivityDirective,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [...components],
    declarations: [...components],
    providers: [],
})
export class PLFlashcardsActivityModule { }

export {
    PLFlashcardsActivityDirective,
};
