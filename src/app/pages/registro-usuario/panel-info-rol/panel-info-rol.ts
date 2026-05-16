import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rol } from '../../../shared/models/rol.model';
import { ApiService } from '../../../core/services/ApiService';

interface UsuarioRolResumen {
  nombre: string;
}

@Component({
  selector: 'app-panel-info-rol',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-info-rol.html',
  styleUrl: './panel-info-rol.scss',
})
export class PanelInfoRol implements OnChanges {

  @Input() rol: Rol | null = null;

  nivelJerarquico: string = '';
  responsabilidades: string[] = [];
  ultimos: UsuarioRolResumen[] = [];
  cargandoUltimos: boolean = false;

  constructor(private api: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rol']) {
      this.actualizarDatos();
    }
  }

  private actualizarDatos(): void {
    if (!this.rol) {
      this.reset();
      return;
    }

    switch (this.rol.id_Rol) {
      case 1:  this.nivelJerarquico = 'ÉLITE'; break;
      case 2:  this.nivelJerarquico = 'ALTO';  break;
      case 3:
      case 4:
      case 5:
      case 6:  this.nivelJerarquico = 'MEDIO'; break;
      case 7:
      case 8:  this.nivelJerarquico = 'BAJO';  break;
      default: this.nivelJerarquico = '';
    }

    this.responsabilidades = this.rol.descripcion ? [this.rol.descripcion] : [];

    this.cargarUltimos(this.rol.id_Rol);
  }

  private cargarUltimos(idRol: number): void {
    this.cargandoUltimos = true;
    this.ultimos = [];
    this.api.get<UsuarioRolResumen[]>(`usuarios/por-rol/${idRol}`).subscribe({
      next: (data) => {
        console.log('[PanelInfoRol] ultimos por rol', idRol, data);
        this.ultimos = data;
        this.cargandoUltimos = false;
      },
      error: (err) => {
        console.error('[PanelInfoRol] error cargando ultimos:', err);
        this.ultimos = [];
        this.cargandoUltimos = false;
      }
    });
  }

  private reset(): void {
    this.nivelJerarquico = '';
    this.responsabilidades = [];
    this.ultimos = [];
    this.cargandoUltimos = false;
  }
}
