import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PCProfileComponent } from './pc-profile.component';

describe('PCProfileComponent', () => {
  let component: PCProfileComponent;
  let fixture: ComponentFixture<PCProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PCProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PCProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
