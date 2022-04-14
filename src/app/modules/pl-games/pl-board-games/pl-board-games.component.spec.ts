import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlBoardGamesComponent } from './pl-board-games.component';

describe('PlBoardGamesComponent', () => {
    let component: PlBoardGamesComponent;
    let fixture: ComponentFixture<PlBoardGamesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PlBoardGamesComponent],
        })
    .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlBoardGamesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
