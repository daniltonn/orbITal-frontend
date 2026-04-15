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
  @Input() rol: string = '';
  ultimos: { nombre: string; poder: string }[] = [];
  nivelJerarquico: string = '';
  responsabilidades: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rol']) {
      this.actualizarDatos();
    }
  }

  private actualizarDatos(): void {

    if (this.rol === 'Emperador') {
      this.nivelJerarquico = 'ÉLITE';
      this.responsabilidades = [
        'Gobernar el imperio galáctico',
        'Tomar decisiones estratégicas absolutas',
        'Supervisar todas las operaciones'
      ];
      this.ultimos = [
        { nombre: 'Freezer Supremo', poder: '530,000' },
        { nombre: 'Lord Kaltor', poder: '510,000' },
        { nombre: 'Emperador Zyron', poder: '495,000' }
      ];

    } else if (this.rol === 'Comandante') {
      this.nivelJerarquico = 'ALTO';
      this.responsabilidades = [
        'Dirigir flotas y misiones',
        'Supervisar tropas',
        'Ejecutar órdenes del emperador'
      ];
      this.ultimos = [
        { nombre: 'Kael Vortex', poder: '185,000' },
        { nombre: 'Draven Korr', poder: '172,000' },
        { nombre: 'Zyrax Dune', poder: '168,000' }
      ];

    } else if (this.rol === 'Analista') {
      this.nivelJerarquico = 'MEDIO';
      this.responsabilidades = [
        'Analizar datos estratégicos',
        'Optimizar recursos',
        'Apoyar decisiones tácticas'
      ];
      this.ultimos = [
        { nombre: 'Lyra Quantis', poder: '120,000' },
        { nombre: 'Nexor Byte', poder: '118,000' },
        { nombre: 'Vaal Sigma', poder: '122,000' }
      ];

    } else if (this.rol === 'Desarrollador') {
      this.nivelJerarquico = 'MEDIO';
      this.responsabilidades = [
        'Desarrollar sistemas del imperio',
        'Mantener tecnología Scouter',
        'Optimizar plataformas internas'
      ];
      this.ultimos = [
        { nombre: 'Dev-X01 Orion', poder: '95,000' },
        { nombre: 'Kryon Stack', poder: '98,000' },
        { nombre: 'Zent Codeus', poder: '102,000' }
      ];

    } else if (this.rol === 'Especialista') {
      this.nivelJerarquico = 'MEDIO';
      this.responsabilidades = [
        'Ejecutar tareas especializadas',
        'Apoyar operaciones críticas',
        'Resolver problemas técnicos'
      ];
      this.ultimos = [
        { nombre: 'Spec Delta-9', poder: '110,000' },
        { nombre: 'Arkon Vex', poder: '108,000' },
        { nombre: 'Tyr Lexor', poder: '112,000' }
      ];

    } else if (this.rol === 'Gestor') {
      this.nivelJerarquico = 'MEDIO';
      this.responsabilidades = [
        'Coordinar equipos',
        'Gestionar operaciones internas',
        'Supervisar cumplimiento de objetivos'
      ];
      this.ultimos = [
        { nombre: 'Marek Voltan', poder: '101,000' },
        { nombre: 'Seltra Vion', poder: '99,500' },
        { nombre: 'Korin Dex', poder: '103,000' }
      ];

    } else if (this.rol === 'Guerrero de Conquista') {
      this.nivelJerarquico = 'BAJO';
      this.responsabilidades = [
        'Conquistar planetas',
        'Ejecutar misiones de combate',
        'Eliminar resistencia enemiga'
      ];
      this.ultimos = [
        { nombre: 'Brakk el Destructor', poder: '60,000' },
        { nombre: 'Zorak Sangre Fría', poder: '58,000' },
        { nombre: 'Threx Omega', poder: '62,000' }
      ];

    } else if (this.rol === 'Sistema Scouter') {
      this.nivelJerarquico = 'BAJO';
      this.responsabilidades = [
        'Monitorear niveles de poder',
        'Proveer información en tiempo real',
        'Asistir en decisiones tácticas'
      ];
      this.ultimos = [
        { nombre: 'Scouter-X900', poder: 'N/A' },
        { nombre: 'EyeUnit-77', poder: 'N/A' },
        { nombre: 'Probe-Kai', poder: 'N/A' }
      ];

    } else {
      this.nivelJerarquico = '';
      this.responsabilidades = [];
      this.ultimos = [];
    }
  }
}