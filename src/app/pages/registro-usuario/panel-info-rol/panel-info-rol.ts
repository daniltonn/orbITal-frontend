import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel-info-rol',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-info-rol.html',
  styleUrl: './panel-info-rol.scss',
})
export class PanelInfoRol implements OnChanges {

  @Input() rol: any = null;

  nivelJerarquico: string = '';
  responsabilidades: string[] = [];
  ultimos: { nombre: string; poder: string }[] = [];

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

    // 🔥 NIVEL basado en ID (esto sí tiene lógica de negocio)
    switch (this.rol.id_Rol) {
      case 1:
        this.nivelJerarquico = 'ÉLITE';
        break;
      case 2:
        this.nivelJerarquico = 'ALTO';
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        this.nivelJerarquico = 'MEDIO';
        break;
      case 7:
      case 8:
        this.nivelJerarquico = 'BAJO';
        break;
      default:
        this.nivelJerarquico = '';
    }

    // 🔥 RESPONSABILIDAD desde backend (NO hardcode)
    this.responsabilidades = [this.rol.descripcion];

    // 🔥 DATOS VISUALES (esto sí puedes mantener ficticio)
    this.ultimos = this.getUltimosPorRol(this.rol.nombre_Rol);
  }

  private getUltimosPorRol(nombre: string) {
    const data: any = {
      'Emperador': [
        { nombre: 'Freezer Supremo', poder: '530,000' },
        { nombre: 'Lord Kaltor', poder: '510,000' },
        { nombre: 'Emperador Zyron', poder: '495,000' }
      ],
      'Comandante': [
        { nombre: 'Kael Vortex', poder: '185,000' },
        { nombre: 'Draven Korr', poder: '172,000' }
      ],
      'Analista': [
        { nombre: 'Lyra Quantis', poder: '120,000' }
      ],
      'Desarrollador': [
        { nombre: 'Dev-X01 Orion', poder: '95,000' }
      ],
      'Especialista': [
        { nombre: 'Spec Delta-9', poder: '110,000' }
      ],
      'Gestor': [
        { nombre: 'Marek Voltan', poder: '101,000' }
      ],
      'Guerrero de Conquista': [
        { nombre: 'Brakk el Destructor', poder: '60,000' }
      ],
      'Sistema Scouter': [
        { nombre: 'Scouter-X900', poder: 'N/A' }
      ]
    };

    return data[nombre] || [];
  }

  private reset() {
    this.nivelJerarquico = '';
    this.responsabilidades = [];
    this.ultimos = [];
  }
}