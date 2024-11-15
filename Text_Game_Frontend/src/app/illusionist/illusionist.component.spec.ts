import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllusionistComponent } from './illusionist.component';

describe('IllusionistComponent', () => {
  let component: IllusionistComponent;
  let fixture: ComponentFixture<IllusionistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IllusionistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IllusionistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
