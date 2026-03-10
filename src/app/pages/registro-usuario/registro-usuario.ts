// ──────────────────────────────────────────────────────────
// Registro de Usuario — Lógica del formulario
// Solo accesible para administradores del Imperio
// ──────────────────────────────────────────────────────────

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro-usuario.html',
  styleUrl: './registro-usuario.scss'
})
export class RegistroUsuario {

  // Variables enlazadas con los campos del formulario
  nombre: string = '';
  email: string = '';
  rol: string = '';
  nivelPoder: string = '';
  password: string = '';
  passwordConfirm: string = '';

  // Estados de la pantalla
  cargando: boolean = false;
  exitoso: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router) {}

  registrar() {
    this.errorMessage = '';
    this.exitoso = false;

    // Validación: campos obligatorios
    if (!this.nombre || !this.email || !this.rol || !this.password || !this.passwordConfirm) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios.';
      return;
    }

    // Validación: contraseñas coinciden
    if (this.password !== this.passwordConfirm) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;

    // 🔧 MOCK: simula registro exitoso
    // Reemplazar con llamada al backend cuando Fernando entregue el endpoint
    setTimeout(() => {
      this.exitoso = true;
      this.cargando = false;
      // Limpia el formulario después del registro
      this.nombre = '';
      this.email = '';
      this.rol = '';
      this.nivelPoder = '';
      this.password = '';
      this.passwordConfirm = '';
    }, 800);
  }

  // Regresa a la pantalla anterior
  cancelar() {
    this.router.navigate(['/planetas']);
  }
}