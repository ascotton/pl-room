import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { GiphyAnimationsComponent } from './giphy-animations.component';
import { GiphySearchComponent } from './giphy-search/giphy-search.component';
import { GiphyCarouselComponent } from './giphy-carousel/giphy-carousel.component';
import { GiphyPreviewComponent } from './giphy-preview/giphy-preview.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
    ],
    exports: [GiphyAnimationsComponent],
    declarations: [
        GiphyPreviewComponent,
        GiphyCarouselComponent,
        GiphySearchComponent,
        GiphyAnimationsComponent,
    ],
    providers: [],
})
export class GiphyAnimaitonsModule { }
