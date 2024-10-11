import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HungryVampireComponent } from './hungry-vampire.component';

describe('HungryVampireComponent', () => {
  let component: HungryVampireComponent;
  let fixture: ComponentFixture<HungryVampireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HungryVampireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HungryVampireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
