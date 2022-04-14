import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLWorkspaceComponent } from './pl-workspace.component';
import { PLGameModule } from '@root/src/toys/src/modules/game';
import { PLDoubleAssessmentActivityModule } from '../pl-activity/pl-double-assessment-activity';
import { PLFlashcardsActivityModule } from '../pl-activity/pl-flashcards-activity';
import { PLGuessWhoBoardModule } from '../pl-activity/pl-guess-who-board';
import { PLMemoryActivityModule } from '../pl-activity/pl-memory-activity';
import { PLPDFActivityModule } from '../pl-activity/pl-pdf-activity';
import { PLWjAudioAssessmentModule } from '../pl-activity/pl-wj-audio-assessment';
import { PLYoutubeActivityModule } from '../pl-activity/pl-youtube-activity';

@NgModule({
    imports: [
        CommonModule,
        PLGameModule,
        PLDoubleAssessmentActivityModule,
        PLFlashcardsActivityModule,
        PLGuessWhoBoardModule,
        PLMemoryActivityModule,
        PLPDFActivityModule,
        PLWjAudioAssessmentModule,
        PLYoutubeActivityModule,
    ],
    declarations: [
        PLWorkspaceComponent,
    ],
    exports: [
        PLWorkspaceComponent,
    ],
    providers: [
    ],
})
export class PLWorkspaceModule { }

export {
    PLWorkspaceComponent,
};
