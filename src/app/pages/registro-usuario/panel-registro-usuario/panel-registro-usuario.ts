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
  submitted: boolean = false;

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

  get passwordPuntaje(): number {
    const p = this.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.min(score, 4);
  }

  get passwordNivelLabel(): string {
    return ['', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'][this.passwordPuntaje] ?? '';
  }

  barClass(pos: number): object {
    const active = this.passwordPuntaje >= pos;
    return {
      'bar--on': active,
      'bar--debil': active && this.passwordPuntaje === 1,
      'bar--media': active && this.passwordPuntaje === 2,
      'bar--fuerte': active && this.passwordPuntaje === 3,
      'bar--max': active && this.passwordPuntaje >= 4,
    };
  }

  // ── JERARQUÍA
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
    this.submitted = true;
    this.errorMessage = '';
    this.exitoso = false;

    if (!this.nombre || !this.email || !this.rolId || !this.nivelPoder || !this.password || !this.passwordConfirm) {
      return;
    }

    if (!this.email.includes('@')) {
      return;
    }

    if (this.password !== this.passwordConfirm) {
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
          this.submitted = false;

          // reset form
          this.nombre = '';
          this.email = '';
          this.rolId = null;
          this.nivelPoder = '';
          this.password = '';
          this.passwordConfirm = '';

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