import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiddleTellerComponent } from './riddle-teller.component';

describe('RiddleTellerComponent', () => {
  let component: RiddleTellerComponent;
  let fixture: ComponentFixture<RiddleTellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiddleTellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiddleTellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
