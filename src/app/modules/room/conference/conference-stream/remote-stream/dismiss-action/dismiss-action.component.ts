import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DismissService } from './dismiss.service';

@Component({
    selector: 'pl-dismiss-action',
    templateUrl: 'dismiss-action.component.html',
    providers: [
        DismissService,
    ],
})

export class DismissActionComponent implements OnInit {
    disabled$: Observable<boolean>;
    constructor(
        private dismissService: DismissService,
    ) {
        this.disabled$ = dismissService.canDismiss$;
    }

    ngOnInit() { }

    dismiss() {
        this.dismissService.dismiss();
    }
}
