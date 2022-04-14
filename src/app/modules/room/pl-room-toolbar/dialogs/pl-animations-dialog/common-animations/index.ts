import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPaginatorModule } from '@angular/material/paginator';

import { CommonAnimationsComponent } from './common-animations.component';
import { PlayAnimationComponent } from './play-animation/play-animation.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatPaginatorModule,
    ],
    exports: [
        CommonAnimationsComponent,
    ],
    declarations: [
        PlayAnimationComponent,
        CommonAnimationsComponent,
    ],
    providers: [],
})
export class CommonAnimationsModule { }
