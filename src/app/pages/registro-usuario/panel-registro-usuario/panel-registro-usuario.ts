import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { CrearUsuarioService } from '../../../core/services/crear-usuario';
import { Rol } from '../../../shared/models/rol.model';
import { RolService } from '../../../shared/services/rol.service';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './panel-registro-usuario.html',
  styleUrl: './panel-registro-usuario.scss'
})
export class PanelRegistroUsuario implements OnInit {

  // ── FORM ──
  nombre: string = '';
  email: string = '';
  rolId: number | null = null;
  nivelPoder: string = '';
  password: string = '';
  passwordConfirm: string = '';

  // ── ROLES ──
  roles: Rol[] = [];

  // 🔥 AHORA EMITE OBJETO COMPLETO
  @Output() rolChange = new EventEmitter<Rol | null>();

  // ── UI ──
  cargando: boolean = false;
  exitoso: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private crearUsuarioService: CrearUsuarioService,
    private rolService: RolService
  ) {}

  ngOnInit() {
    this.rolService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles.filter(r => r.activo);
      },
      error: (err) => console.error(err)
    });
  }

  // 🔥 CUANDO CAMBIA EL SELECT
  onRolChange() {
  const rolObj = this.roles.find(r => r.id_Rol === this.rolId) || null;

  console.log('ROL EMITIDO:', rolObj); // 👈 DEBUG

  this.rolChange.emit(rolObj);
}

  // 🔥 JERARQUÍA
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

  registrar() {
    this.errorMessage = '';
    this.exitoso = false;

    if (!this.nombre || !this.email || !this.rolId || !this.password || !this.passwordConfirm) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios.';
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;

    const payload = {
      nombre: this.nombre,
      correo: this.email,
      password: this.password,
      id_Rol: this.rolId,
      id_Jerarquia: this.obtenerJerarquia(this.rolId)
    };

    this.crearUsuarioService.registrarUsuario(payload)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: () => {
          this.exitoso = true;

          // reset form
          this.nombre = '';
          this.email = '';
          this.rolId = null;
          this.nivelPoder = '';
          this.password = '';
          this.passwordConfirm = '';

          // 🔥 reset panel derecho
          this.rolChange.emit(null);
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