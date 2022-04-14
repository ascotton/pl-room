import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { PLPermissionsService } from './permissions.service';

// workaround on dynamic generated markup.
const ALWAYS_AUTHORIZED = 'All';

@Directive({ selector: '[plHasPermission]' })
export class PLHasPermissionDirective implements OnInit, OnDestroy {
    private permission$ = new BehaviorSubject<string>('');
    private flag$ = new BehaviorSubject<string>('');
    private hasPermission$: Observable<boolean>;
    private subscription: Subscription;

    @Input()
    set plHasPermission(permission: string) {
        if (permission === this.permission$.getValue()) {
            return;
        }
        this.permission$.next(permission);
    }

    @Input()
    set plHasPermissionUiFlag(flag: string) {
        if (flag === this.flag$.getValue()) {
            return;
        }
        this.flag$.next(flag);
    }

    isHidden = true;

    constructor(
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private permissionService: PLPermissionsService,
    ) {
        const matchPermission$ = this.permission$.pipe(
            switchMap((permission) => {
                if (permission === ALWAYS_AUTHORIZED) {
                    return of(true);
                }

                return this.permissionService.hasPermission(permission);
            }),
        );

        const matchUiFlag$ = this.flag$.pipe(
            switchMap((flag) => {
                if (!flag) {
                    return of(true);
                }

                return this.permissionService.hasEnabledUiFlag(flag);
            }),
        );

        this.hasPermission$ = combineLatest([
            matchPermission$,
            matchUiFlag$,
        ]).pipe(
            map(([matchPermission, matchUiFlag]) => matchPermission && matchUiFlag),
        );
    }

    ngOnInit() {
        this.subscription = this.hasPermission$.subscribe({
            next: this.updateView.bind(this),
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    updateView(hasPermission: boolean) {
        if (hasPermission && this.isHidden) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.isHidden = false;
        } else {
            this.isHidden = true;
            this.viewContainer.clear();
        }
    }
}
