import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrogMerchantEncounterComponent } from './frog-merchant-encounter.component';

describe('FrogMerchantEncounterComponent', () => {
  let component: FrogMerchantEncounterComponent;
  let fixture: ComponentFixture<FrogMerchantEncounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrogMerchantEncounterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrogMerchantEncounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
