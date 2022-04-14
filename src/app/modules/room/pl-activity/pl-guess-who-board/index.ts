import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLGuessWhoBoardDirective } from './pl-guess-who-board.directive';

const components = [
    PLGuessWhoBoardDirective,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [...components],
    declarations: [...components],
    providers: [],
})
export class PLGuessWhoBoardModule { }

export {
    PLGuessWhoBoardDirective,
};
