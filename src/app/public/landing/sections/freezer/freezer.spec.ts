import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Freezer } from './freezer';

describe('Freezer', () => {
  let component: Freezer;
  let fixture: ComponentFixture<Freezer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Freezer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Freezer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
