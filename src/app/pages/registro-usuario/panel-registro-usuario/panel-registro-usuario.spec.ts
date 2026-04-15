import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelRegistroUsuario } from './panel-registro-usuario';

describe('PanelRegistroUsuario', () => {
  let component: PanelRegistroUsuario;
  let fixture: ComponentFixture<PanelRegistroUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelRegistroUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelRegistroUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
