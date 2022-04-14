import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlBoardGamePieceComponent } from './pl-board-game-piece.component';

describe('PlBoardGamePieceComponent', () => {
  let component: PlBoardGamePieceComponent;
  let fixture: ComponentFixture<PlBoardGamePieceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlBoardGamePieceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlBoardGamePieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
