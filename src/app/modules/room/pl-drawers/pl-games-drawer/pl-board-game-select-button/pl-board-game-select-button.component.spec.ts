import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlBoardGameSelectButtonComponent } from './pl-board-game-select-button.component';

describe('PlGameSelectButtonComponent', () => {
  let component: PlBoardGameSelectButtonComponent;
  let fixture: ComponentFixture<PlBoardGameSelectButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlBoardGameSelectButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlBoardGameSelectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
