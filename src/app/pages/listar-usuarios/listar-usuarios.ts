import { Component } from '@angular/core';
import { usuarios } from './usuarios';
import { CardComponent } from './card/card';
import { CommonModule } from '@angular/common';
import { galaxiasData } from './galaxiaData';



@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  templateUrl: './listar-usuarios.html',
  imports: [CardComponent, CommonModule],
  styleUrls: ['./listar-usuarios.scss']
})
export class ListarUsuariosComponent {

  usuarios = usuarios;

  rolSeleccionado: string | null = null;

  rolesDisponibles = [
    'Comandante',
    'Analista',
    'Desarrollador',
    'Especialista',
    'Gestor',
    'Guerrero de Conquista',
    'Sistema Scouter'
  ];

  seleccionarRol(rol: string | null) {
    this.rolSeleccionado = rol;
  }

  getColorRol(rol: string) {
  return galaxiasData.find(r => r.rol === rol)?.color || '#ffffff';
}

  get usuariosFiltrados() {
    if (!this.rolSeleccionado) return this.usuarios;

    return this.usuarios.filter(
      u => u.rol === this.rolSeleccionado
    );
  }
}