// ──────────────────────────────────────────────────────────
// Registrar Planeta — HU1
// Como Comandante de Flota quiero registrar un planeta
// en el catálogo planetario
// ──────────────────────────────────────────────────────────

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrar.html',
  styleUrl: './registrar.scss'
})
export class RegistrarPlaneta {

  // Variables del formulario — Datos Generales
  nombre: string = '';
  coordenadasX: string = '';
  coordenadasY: string = '';
  atmosfera: string = 'Nitrógeno-Oxígeno';
  nivelTecnologico: string = 'Primitivo';
  poblacion: string = '';

  // Variables del formulario — Evaluación de Recursos
  recursos: string[] = [];
  nuevoRecurso: string = '';
  mostrarInputRecurso: boolean = false;
  dificultad: string = 'Medio';
  valorEstimado: string = '';
  estado: string = 'Identificado';

  // Estados de la pantalla
  cargando: boolean = false;
  exitoso: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router) {}

  // Muestra el input para agregar un nuevo recurso
  agregarRecurso() {
    this.mostrarInputRecurso = true;
  }

  // Confirma el recurso escrito y lo agrega a la lista
  confirmarRecurso() {
    if (this.nuevoRecurso.trim()) {
      this.recursos.push(this.nuevoRecurso.trim());
      this.nuevoRecurso = '';
      this.mostrarInputRecurso = false;
    }
  }

  registrar() {
    this.errorMessage = '';
    this.exitoso = false;

    // Validación: campos obligatorios
    if (!this.nombre || !this.coordenadasX || !this.coordenadasY) {
      this.errorMessage = 'Por favor complete los campos obligatorios: nombre y coordenadas.';
      return;
    }

    this.cargando = true;

    // 🔧 MOCK: simula registro exitoso
    // Reemplazar con llamada al backend cuando Fernando entregue el endpoint
    setTimeout(() => {
      this.exitoso = true;
      this.cargando = false;
      // Redirige al catálogo de planetas después de registrar
      setTimeout(() => this.router.navigate(['/planetas']), 1500);
    }, 800);
  }

  // Limpia todos los campos del formulario
  limpiar() {
    this.nombre = '';
    this.coordenadasX = '';
    this.coordenadasY = '';
    this.atmosfera = 'Nitrógeno-Oxígeno';
    this.nivelTecnologico = 'Primitivo';
    this.poblacion = '';
    this.recursos = [];
    this.dificultad = 'Medio';
    this.valorEstimado = '';
    this.estado = 'Identificado';
    this.errorMessage = '';
    this.exitoso = false;
  }
}