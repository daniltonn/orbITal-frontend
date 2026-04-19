// ──────────────────────────────────────────────────────────
// Registro de Usuario — HU0 (VERSIÓN CON BACKEND)
// ──────────────────────────────────────────────────────────

import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CrearUsuarioService } from '../../../core/services/crear-usuario';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './panel-registro-usuario.html',
  styleUrl: './panel-registro-usuario.scss'
})
export class PanelRegistroUsuario {
  
  // ── FORM ──
  nombre: string = '';
  email: string = '';
  rol: string = ''; // 👈 sigue siendo string (HTML NO se toca)
  nivelPoder: string = '';
  password: string = '';
  passwordConfirm: string = '';

  // ── OUTPUT (panel derecho) ──
  @Output() rolChange = new EventEmitter<string>();

  // ── UI STATE ──
  cargando: boolean = false;
  exitoso: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private crearUsuarioService: CrearUsuarioService
  ) {}

  // 🔥 MAPEO STRING → ID (BACKEND)
  private getRolId(rol: string): number {
    const map: { [key: string]: number } = {
      'Emperador': 1,
      'Comandante': 2,
      'Analista': 3,
      'Desarrollador': 4,
      'Especialista': 5,
      'Gestor': 6,
      'Guerrero de Conquista': 7,
      'Sistema Scouter': 8
    };

    return map[rol] || 0;
  }

  // 🔥 MAPEO ID → JERARQUÍA
  private obtenerJerarquia(idRol: number): number {
    switch (idRol) {
      case 1: return 1;
      case 2: return 2;
      case 3:
      case 4:
      case 5:
      case 6: return 3;
      case 7:
      case 8: return 4;
      default: return 5;
    }
  }

  // 🔥 evento del select (NO tocamos HTML)
  onRolChange(value: string) {
    this.rol = value;
    this.rolChange.emit(this.rol); // 👈 panel derecho sigue funcionando
  }

  registrar() {
    this.errorMessage = '';
    this.exitoso = false;

    // Validaciones
    if (!this.nombre || !this.email || !this.rol || !this.password || !this.passwordConfirm) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios.';
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const idRol = this.getRolId(this.rol);

    if (!idRol) {
      this.errorMessage = 'Seleccione un rol válido.';
      return;
    }

    this.cargando = true;

    const payload = {
      nombre: this.nombre,
      correo: this.email,
      password: this.password,
      id_Rol: idRol,
      id_Jerarquia: this.obtenerJerarquia(idRol)
    };

    this.crearUsuarioService.registrarUsuario(payload)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: () => {
          this.exitoso = true;

          // reset
          this.nombre = '';
          this.email = '';
          this.rol = '';
          this.nivelPoder = '';
          this.password = '';
          this.passwordConfirm = '';
        },
        error: (err) => {
          console.error(err);
          this.errorMessage =
            err?.error?.message ||
            err?.error ||
            'Error al registrar usuario';
        }
      });
  }

  cancelar() {
    this.router.navigate(['/planetas']);
  }
}