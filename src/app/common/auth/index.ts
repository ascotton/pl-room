import { NgModule } from '@angular/core';
import { PLHasPermissionDirective } from './has-permission.directive';
import { PLPermissionsService } from './permissions.service';

@NgModule({
    imports: [],
    exports: [PLHasPermissionDirective],
    declarations: [PLHasPermissionDirective],
    providers: [PLPermissionsService],
})
export class PLPermissionsModule { }
