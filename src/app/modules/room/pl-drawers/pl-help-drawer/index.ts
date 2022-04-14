import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLHelpDrawerComponent } from './pl-help-drawer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
    ],
    declarations: [
        PLHelpDrawerComponent,
    ],
    exports: [
        PLHelpDrawerComponent,
    ],
})
export class PLHelpDrawerModule { }
