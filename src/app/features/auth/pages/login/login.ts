// ──────────────────────────────────────────────────────────
// Login — HU1
// Como Comandante de Flota quiero iniciar sesión para
// acceder al sistema de control galáctico del Imperio
// ──────────────────────────────────────────────────────────

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService} from '../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { Background } from '../../../../shared/backgrounds/login/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Background],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  email: string = '';
  password: string = '';
  recordarSesion: boolean = false;
  emailFocus = false;
  passwordFocus = false;

  cargando: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {

    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingrese su ID de comandante y contraseña.';
      return;
    }

    this.cargando = true;

    this.authService.login({
      correo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           :this.email, 
      password: this.password
    })
      .pipe(
        finalize(() => this.cargando = false)
      )
      .subscribe({

        next: (res: string) => {

          console.log('Respuesta:', res)

          if (this.recordarSesion) {
            localStorage.setItem('recordarSesion', 'true');
          }

          this.router.navigate(['/planetas']);
        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            'Credenciales inválidas. Verifique su ID de comandante.';
        }

      });
  }
}