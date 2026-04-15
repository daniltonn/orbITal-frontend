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

    if (this.rol === 'Comandante de Flota') {
      this.nivelJerarquico = 'ALTO';
      this.responsabilidades = [
        'Dirigir flotas y misiones',
        'Supervisar equipos operativos',
        'Reportar directamente al emperador'
      ];
      this.ultimos = [
        { nombre: 'Dodoria', poder: '150,000' },
        { nombre: 'Zarbon', poder: '142,000' },
        { nombre: 'Ginyu', poder: '193,000' }
      ];
    } else if (this.rol === 'Analista de Recursos') {
      this.nivelJerarquico = 'MEDIO';
      this.responsabilidades = [
        'Analizar recursos y suministros',
        'Gestionar logística de misiones',
        'Colaborar con el equipo de inteligencia'
      ];
      this.ultimos = [
        { nombre: 'Recoome', poder: '120,000' },
        { nombre: 'Burter', poder: '130,000' },
        { nombre: 'Bryanna', poder: '125,000' }
      ];
    }
    else if (this.rol === 'Gestor de Relaciones con Mercenarios') {
      this.nivelJerarquico = 'MEDIO';
      this.responsabilidades = [
        'Negociar contratos con mercenarios',
        'Coordinar misiones con mercenarios',
        'Mantener relaciones con grupos mercenarios'
      ];
      this.ultimos = [
        { nombre: 'Jeice', poder: '110,000' },
        { nombre: 'Guldo', poder: '115,000' },
        { nombre: 'Ras', poder: '120,000' }
      ];
    } 
    else if (this.rol === 'Experto en Suspensión de Rebeliones') {
      this.nivelJerarquico = 'ALTO';
      this.responsabilidades = [
        'Planificar estrategias para suprimir rebeliones',
        'Coordinar operaciones militares contra rebeldes',
        'Colaborar con el equipo de inteligencia para identificar focos de rebelión'
      ];
      this.ultimos = [
        { nombre: 'Vegeta', poder: '2110,000' },
        { nombre: 'Kaiu', poder: '290,000' },
        { nombre: 'Preyk', poder: '150,000' }
      ];
    } else {
      this.nivelJerarquico = '';
      this.responsabilidades = [];
      this.ultimos = [];
    }
  }
}