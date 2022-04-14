import { Injectable } from '@angular/core';
import { PLHttpService } from '@root/src/lib-components';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Student } from './student.model';
import {
    debounceTime,
    startWith,
    distinctUntilChanged,
    switchMap,
    shareReplay,
    map,
    filter,
    take,
    tap,
} from 'rxjs/operators';
import moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState } from '@root/src/app/store';
import { selectAuth } from '../../../user/store';

function parseDate(input: string) {
    return moment(input, 'YYYY-MM-DD').toDate();
}

@Injectable()
export class HomeworkService {
    private fetching$ = new BehaviorSubject(false);
    private filter$ = new Subject<string>();
    private students$: Observable<Student[]>;
    private refresh$ = new Subject<object>();

    readonly studentsWithPermission$: Observable<Student[]>;
    readonly studentsWithoutPermission$: Observable<Student[]>;
    readonly loading$: Observable<boolean>;

    constructor(
        private plHttp: PLHttpService,
        private store: Store<AppState>,
    ) {
        this.loading$ = this.fetching$.asObservable();

        const user$ = this.refresh$.pipe(
            startWith({}),
            switchMap(() => this.store.select(selectAuth).pipe(
                filter(({ isAuthenticated }) => isAuthenticated),
                map(({ user }) => user),
                take(1),
            )),
        );

        this.students$ = user$.pipe(
            tap(() => {
                this.fetching$.next(true);
            }),
            switchMap(user => this.plHttp.get('clients', {
                provider: user.uuid,
                with_recent_homework: true,
                limit: 1000,
            })),
            map((response: any) => response.results),
            map((students: any[]) => students.map(st => ({
                ...st,
                display_name: `${st.first_name} ${st.last_name}`,
                recent_homework: st.recent_homework ? {
                    ...st.recent_homework,
                    assigned_date: parseDate(st.recent_homework.assigned_date),
                    due_date: parseDate(st.recent_homework.due_date),
                } : null,
            }))),
            tap(() => {
                this.fetching$.next(false);
            }),
            shareReplay({ refCount: true, bufferSize: 1 }),
        );
        this.studentsWithPermission$ = this.filter$.pipe(
            startWith(''),
            distinctUntilChanged(),
            debounceTime(500),
            switchMap(term => this.students$.pipe(
                map(students => students.filter(this.hasPermission)),
                map(students => students.filter((st) => {
                    return st.display_name.toLowerCase().includes(term.toLowerCase());
                })),
            )),
        );

        this.studentsWithoutPermission$ = this.students$.pipe(
            map(students => students.filter(st => !this.hasPermission(st))),
        );
    }

    refresh() {
        this.refresh$.next({});
    }

    filter(term: string) {
        this.filter$.next(term);
    }

    private hasPermission(student: Student) {
        return Boolean(student.recent_homework);
    }
}
