import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Asignar } from './asignar';

describe('Asignar', () => {
  let component: Asignar;
  let fixture: ComponentFixture<Asignar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Asignar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Asignar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
