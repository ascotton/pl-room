import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MutationObserverService {
    private resizeObserver: MutationObserver;
    private targetsMap = new Map<Node, Subject<MutationRecord>>();

    constructor() {
        this.resizeObserver = new MutationObserver(
            entries => this.observerCallback(entries),
        );
    }

    observe(target: Node, options?: MutationObserverInit) {
        const subject = new Subject<MutationRecord>();
        this.targetsMap.set(target, subject);
        this.resizeObserver.observe(target, options);
        return subject.asObservable();
    }

    disconnect() {
        this.resizeObserver.disconnect();
    }

    private emitEntry(target: Node, entry: MutationRecord) {
        if (!this.targetsMap.has(target)) {
            return;
        }

        this.targetsMap.get(target).next(entry);
    }

    private observerCallback(entries: MutationRecord[]) {
        for (const entry of entries) {
            if (!this.targetsMap.has(entry.target)) {
                continue;
            }

            this.emitEntry(entry.target, entry);
        }
    }
}
