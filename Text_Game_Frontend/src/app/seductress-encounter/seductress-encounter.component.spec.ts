import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeductressEncounterComponent } from './seductress-encounter.component';

describe('SeductressEncounterComponent', () => {
  let component: SeductressEncounterComponent;
  let fixture: ComponentFixture<SeductressEncounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeductressEncounterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeductressEncounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
