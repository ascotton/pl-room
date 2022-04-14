import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { PLAbstractUserIDService } from '@root/index';
import { AppState } from '../../store';
import { selectCurrentUser } from './store';

@Injectable()
export class CurrentUserUserIDService implements PLAbstractUserIDService {
    constructor(private store: Store<AppState>) {}

    userID(): Observable<string> {
        return this.store.select(selectCurrentUser)
            .pipe(
                map(user => (user && user.uuid) || '')
            );
    }
}
