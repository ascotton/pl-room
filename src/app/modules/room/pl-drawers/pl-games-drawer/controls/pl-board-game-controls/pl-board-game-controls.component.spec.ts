import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PLBoardGameControlsComponent } from './pl-board-game-controls.component';

describe('PLBoardGameControlsComponent', () => {
    let component: PLBoardGameControlsComponent;
    let fixture: ComponentFixture<PLBoardGameControlsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PLBoardGameControlsComponent]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PLBoardGameControlsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
