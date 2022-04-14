import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlGamesComponent } from './pl-games.component';

describe('PlGamesComponent', () => {
    let component: PlGamesComponent;
    let fixture: ComponentFixture<PlGamesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PlGamesComponent],
        })
    .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlGamesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
