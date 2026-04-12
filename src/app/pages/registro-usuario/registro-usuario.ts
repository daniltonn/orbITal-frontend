import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './registro-usuario.html',
  styleUrl: './registro-usuario.scss'
})
export class RegistroUsuario {

  nombre: string = '';
  email: string = '';
  rol: string = '';
  nivelPoder: string = ''; // ⚠️ ya no se envía
  password: string = '';
  passwordConfirm: string = '';

  cargando: boolean = false;
  exitoso: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  // 🔥 MAPEO DE ROLES (IMPORTANTE)
  private mapRol(rol: string): number {
    switch (rol) {
      case 'Emperador': return 1;
      case 'Comandante de Flota': return 2;
      case 'Analista de Recursos': return 3;
      default: return 0;
    }
  }

  registrar() {
    this.errorMessage = '';
    this.exitoso = false;

    if (!this.nombre || !this.email || !this.rol || !this.password || !this.passwordConfirm) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios.';
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const payload = {
      nombre: this.nombre,
      correo: this.email,
      password: this.password,
      id_Rol: this.mapRol(this.rol),
      id_Jerarquia: 1 // ⚠️ temporal (puedes hacerlo dinámico luego)
    };

    this.cargando = true;

    this.http.post('http://localhost:5186/api/auth/register', payload)
      .subscribe({
        next: () => {
          this.exitoso = true;
          this.cargando = false;

          this.nombre = '';
          this.email = '';
          this.rol = '';
          this.password = '';
          this.passwordConfirm = '';
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al registrar usuario';
          this.cargando = false;
        }
      });
  }

  cancelar() {
    this.router.navigate(['/planetas']);
  }
}