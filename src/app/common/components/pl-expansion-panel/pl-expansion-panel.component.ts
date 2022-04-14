import { Component, Output, EventEmitter, ViewEncapsulation, OnDestroy, Optional, Host, HostBinding } from '@angular/core';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { PLAccordionDirective } from './pl-accordion.directive';
import { trigger, state, transition, animate, style } from '@angular/animations';

let nextId = 0;

@Component({
    selector: 'pl-expansion-panel',
    templateUrl: 'pl-expansion-panel.component.html',
    styleUrls: ['pl-expansion-panel.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('bodyExpansion', [
            state('collapsed', style({ height: '0px', visibility: 'hidden' })),
            state('expanded', style({ height: '*', visibility: 'visible' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4,0,0.2,1)'),
            ),
        ]),
    ],
})

export class PLExpansionPanelComponent implements OnDestroy {
    readonly id = `pl-expansion-panel-${nextId++}`;

    private _expanded = false;
    @Output() readonly closed: EventEmitter<void> = new EventEmitter<void>();
    @Output() readonly opened: EventEmitter<void> = new EventEmitter<void>();

    @HostBinding('class.pl-expansion-panel') plExpansionPanelClass = true;

    get expanded() {
        return this._expanded;
    }
    set expanded(val: boolean) {
        if (this._expanded === Boolean(val)) {
            return;
        }

        this._expanded = val;
        if (val) {
            this.opened.emit();
            if (this.accordion) {
                this._expansionDispatcher.notify(this.id, this.accordion.id);
            }
        } else {
            this.closed.emit();
        }
    }

    private _removeUniqueSelectionListener: () => void = () => {};

    constructor(
        private _expansionDispatcher: UniqueSelectionDispatcher,
        @Optional() public accordion: PLAccordionDirective,
    ) {
        this._removeUniqueSelectionListener = _expansionDispatcher.listen((id: string, accordionId: string) => {
            if (this.accordion && this.accordion.id === accordionId && this.id !== id) {
                this.expanded = false;
            }
        });
    }

    ngOnDestroy() {
        this._removeUniqueSelectionListener();
    }

    toggle() {
        this.expanded = !this.expanded;
    }

    open() {
        this.expanded = true;
    }

    close() {
        this.expanded = false;
    }
}
