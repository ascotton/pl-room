import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { of, Observable } from 'rxjs';
import { User } from '@modules/user/user.model';
import { selectCurrentUser, selectUiFlags } from '../../modules/user/store';
import { map } from 'rxjs/operators';

type PermissionPredicate = (user: User) => boolean;

type PredefinedPermission = string | PermissionPredicate;

const PERMS_DEFAULT_PROVIDERS = 'Therapist || Administrator || School Staff Providers || Private Practice';
const PERMS_ALL_NONSTUDENTS =
    'Observer || Therapist || Administrator || School Staff Providers || Private Practice';
const PERMS_STUDENTS = 'Student';

const isPLProvider: PermissionPredicate = (user) => {
    const isTherapist = user.groups.includes('Therapist');
    const isSLP = user.groups.includes('SLP');
    return isTherapist && isSLP;
};

const predefinedMap: Record<string, PredefinedPermission> = {
    PERMS_DEFAULT_PROVIDERS,
    PERMS_ALL_NONSTUDENTS,
    PERMS_STUDENTS,
    PERMS_PL_SLP_PROVIDERS: isPLProvider,
};

@Injectable()
export class PLPermissionsService {
    private user$: Observable<User>;
    private uiFlags$: Observable<Record<string, boolean>>;

    constructor(private store: Store<AppState>) {
        this.user$ = this.store.select(selectCurrentUser);
        this.uiFlags$ = this.store.select(selectUiFlags);
    }

    hasPermission(authString: string) {
        if (!authString) {
            return of(false);
        }

        const predefinedPermission = predefinedMap[authString] || authString;

        return this.user$.pipe(
            map((user) => {
                if (typeof predefinedPermission === 'function') {
                    return predefinedPermission(user);
                }

                const permissions = predefinedPermission.split(' || ');

                return this.checkUserPermission(user, permissions);
            }),
        );
    }

    hasEnabledUiFlag(flag: string) {
        return this.uiFlags$.pipe(
            map(flags => flags[flag]),
        );
    }

    private checkUserPermission(user: User, roles: string[]) {
        return roles.some((role) => {
            const { groups = [] } = user;
            return groups.includes(role.trim());
        });
    }
}
