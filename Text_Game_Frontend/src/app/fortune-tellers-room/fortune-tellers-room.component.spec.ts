import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FortuneTellersRoomComponent } from './fortune-tellers-room.component';

describe('FortuneTellersRoomComponent', () => {
  let component: FortuneTellersRoomComponent;
  let fixture: ComponentFixture<FortuneTellersRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FortuneTellersRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FortuneTellersRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
