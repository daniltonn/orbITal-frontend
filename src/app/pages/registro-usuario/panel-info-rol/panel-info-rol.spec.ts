import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelInfoRol } from './panel-info-rol';

describe('PanelInfoRol', () => {
  let component: PanelInfoRol;
  let fixture: ComponentFixture<PanelInfoRol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelInfoRol]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelInfoRol);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
