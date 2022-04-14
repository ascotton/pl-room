import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PLPieceSelectButtonComponent } from './pl-piece-select-button.component';

describe('PLPieceSelectButtonComponent', () => {
    let component: PLPieceSelectButtonComponent;
    let fixture: ComponentFixture<PLPieceSelectButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PLPieceSelectButtonComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PLPieceSelectButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
