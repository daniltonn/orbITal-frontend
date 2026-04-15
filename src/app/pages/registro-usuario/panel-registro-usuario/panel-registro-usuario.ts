// ──────────────────────────────────────────────────────────
// Registro de Usuario — HU0
// Como Administrador del Imperio quiero registrar nuevos
// usuarios para otorgarles acceso al sistema galáctico
// Solo accesible para administradores del Imperio
// ──────────────────────────────────────────────────────────

import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Sidebar } from '../../../shared/sidebar/sidebar';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './panel-registro-usuario.html',
  styleUrl: './panel-registro-usuario.scss'
})
export class PanelRegistroUsuario {
  
  // ── Variables enlazadas con los campos del formulario via [(ngModel)] ──
  nombre: string = '';
  email: string = '';
  rol: string = '';
  nivelPoder: string = '';
  password: string = '';
  passwordConfirm: string = ''; // se compara con password en la validación

  @Output() rolChange = new EventEmitter<string>();

  onRolChange(value: string) {
    this.rol = value;
    this.rolChange.emit(this.rol);
  }

  // ── Variables de estado de la pantalla ──
  cargando: boolean = false;  // deshabilita el botón mientras se procesa el registro
  exitoso: boolean = false;   // muestra la alerta verde tras un registro exitoso
  errorMessage: string = '';  // muestra la alerta roja si hay error de validación

  // Router inyectado para redirigir al cancelar
  constructor(private router: Router) {}

  // Valida el formulario y simula el registro del usuario
  registrar() {
    this.errorMessage = '';
    this.exitoso = false;

    // Validación: todos los campos obligatorios deben estar completos
    if (!this.nombre || !this.email || !this.rol || !this.password || !this.passwordConfirm) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios.';
      return;
    }

    // Validación: ambas contraseñas deben coincidir antes de continuar
    if (this.password !== this.passwordConfirm) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;

    // 🔧 MOCK: simula el delay de una petición HTTP al backend (800ms)
    // Reemplazar con llamada al servicio cuando esté disponible el endpoint
    setTimeout(() => {
      this.exitoso = true;
      this.cargando = false;
      // Resetea el formulario para permitir registrar otro usuario sin recargar
      this.nombre         = '';
      this.email          = '';
      this.rol            = '';
      this.nivelPoder     = '';
      this.password       = '';
      this.passwordConfirm = '';
    }, 800);
  }

  // Cancela el registro y regresa al catálogo de planetas
  cancelar() {
    this.router.navigate(['/planetas']);
  }
}