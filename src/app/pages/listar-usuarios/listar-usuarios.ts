import { Component } from '@angular/core';
import { usuarios } from './usuarios';
import { CardComponent } from './card/card';
import { CommonModule } from '@angular/common';
import { galaxiasData } from './galaxiaData';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Background } from '../../shared/backgrounds/login/login';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  templateUrl: './listar-usuarios.html',
  imports: [CardComponent, CommonModule, Sidebar, Background, FormsModule],
  styleUrls: ['./listar-usuarios.scss']
})
export class ListarUsuariosComponent {

  usuarios = usuarios;

  // =========================
  // FILTROS
  // =========================
  rolSeleccionado: string | null = null;
  busqueda: string = '';

  minPoder: number | null = null;
  maxPoder: number | null = null;

  orden: 'asc' | 'desc' = 'desc';

  // =========================
  // ROLES
  // =========================
  rolesDisponibles = [
    'Comandante',
    'Analista',
    'Desarrollador',
    'Especialista',
    'Gestor',
    'Guerrero de Conquista',
    'Sistema Scouter'
  ];

  // =========================
  // SELECTORES
  // =========================
  seleccionarRol(rol: string | null) {
    this.rolSeleccionado = rol;
  }

  cambiarOrden() {
    this.orden = this.orden === 'asc' ? 'desc' : 'asc';
  }

  // =========================
  // FILTRO MASTER (EL CORE)
  // =========================
  get usuariosFiltrados() {

    let data = [...this.usuarios];

    // 🔹 filtro por rol
    if (this.rolSeleccionado) {
      data = data.filter(u => u.rol === this.rolSeleccionado);
    }

    // 🔹 búsqueda por nombre
    if (this.busqueda.trim()) {
      data = data.filter(u =>
        u.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }

    // 🔹 rango de poder
    if (this.minPoder !== null) {
      data = data.filter(u => u.nivel_poder >= this.minPoder!);
    }

    if (this.maxPoder !== null) {
      data = data.filter(u => u.nivel_poder <= this.maxPoder!);
    }

    // 🔹 orden
    data.sort((a, b) =>
      this.orden === 'asc'
        ? a.nivel_poder - b.nivel_poder
        : b.nivel_poder - a.nivel_poder
    );

    return data;
  }

  getColorRol(rol: string): string {
  const map: any = {
    Comandante: '#534ab7',
    Analista: '#1a8f4a',
    Desarrollador: '#008fb5',
    Especialista: '#b55a00',
    Gestor: '#b5960a',
    'Guerrero de Conquista': '#8f1a1a',
    'Sistema Scouter': '#5a5a6e'
  };

  return map[rol] || '#ffffff';
}
}