import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Estado } from './estado';

describe('Estado', () => {
  let component: Estado;
  let fixture: ComponentFixture<Estado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Estado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Estado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
