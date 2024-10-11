import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MothMonsterComponent } from './moth-monster.component';

describe('MothMonsterComponent', () => {
  let component: MothMonsterComponent;
  let fixture: ComponentFixture<MothMonsterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MothMonsterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MothMonsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
