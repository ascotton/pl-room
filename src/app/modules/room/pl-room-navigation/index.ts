import { NgModule } from '@angular/core';

import { PLRoomNavigationComponent } from './pl-room-navigation.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
    imports: [
        MatSidenavModule,
    ],
    exports: [],
    declarations: [PLRoomNavigationComponent],
    providers: [],
})
export class PLRoomNavigationModule { }
