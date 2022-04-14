import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { teardown } from '../rxjs/operators';

@Injectable()
export class ResizeObserverService {
    private resizeObserver: ResizeObserver;
    private targetsMap = new Map<Element, Subject<ResizeObserverEntry>>();

    constructor() {
        this.resizeObserver = new ResizeObserver(
            entries => this.observerCallback(entries),
        );
    }

    observe(target: Element, options?: ResizeObserverOptions) {
        const subject = new Subject<ResizeObserverEntry>();
        this.targetsMap.set(target, subject);
        this.resizeObserver.observe(target, options);
        return subject.asObservable().pipe(
            teardown(() => {
                this.unsubscribe(target);
            }),
        );
    }

    disconnect() {
        this.resizeObserver.disconnect();
    }

    private emitEntry(target: Element, entry: ResizeObserverEntry) {
        if (!this.targetsMap.has(target)) {
            return;
        }

        this.targetsMap.get(target).next(entry);
    }

    private unsubscribe(target: Element) {
        this.resizeObserver.unobserve(target);
        if (this.targetsMap.has(target)) {
            this.targetsMap.delete(target);
        }
    }

    private observerCallback(entries: ResizeObserverEntry[]) {
        for (const entry of entries) {
            if (!this.targetsMap.has(entry.target)) {
                continue;
            }

            this.emitEntry(entry.target, entry);
        }
    }
}
