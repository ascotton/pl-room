import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PLButtonModule, PLDotLoaderModule, PLIconModule } from '@root/index';
import { PLAppGlobalModule } from '../app-global';
import { PLStudentSettingsModule } from './pl-student-settings';
import { PLStudentLoginComponent } from './student-login.component';

const exportedComponents = [
    PLStudentLoginComponent,
];

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        PLIconModule,
        PLButtonModule,
        PLDotLoaderModule,
        PLStudentSettingsModule,
        PLAppGlobalModule,
    ],
    exports: [...exportedComponents],
    declarations: [...exportedComponents],
    providers: [],
})
export class PLStudentLoginModule { }
