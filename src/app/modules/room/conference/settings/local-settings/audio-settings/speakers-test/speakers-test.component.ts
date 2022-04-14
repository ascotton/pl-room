import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SpeakersTestService } from './speakers-test.service';

@Component({
    selector: 'pl-speakers-test',
    templateUrl: 'speakers-test.component.html',
    providers: [
        SpeakersTestService,
    ],
})

export class SpeakersTestComponent implements OnInit {
    public level$: Observable<number>;

    constructor(
        private testService: SpeakersTestService,
    ) {
        this.level$ = this.testService.level$;
    }

    ngOnInit() { }

    test() {
        this.testService.test();
    }
}
