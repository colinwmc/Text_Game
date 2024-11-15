import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellerComponent } from './traveller.component';

describe('TravellerComponent', () => {
  let component: TravellerComponent;
  let fixture: ComponentFixture<TravellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
