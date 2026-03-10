// ──────────────────────────────────────────────────────────
// Login — Lógica del componente de inicio de sesión
// ──────────────────────────────────────────────────────────

import { Component } from '@angular/core'; // Component: permite definir este archivo como un componente de Angular
import { CommonModule } from '@angular/common'; // CommonModule: habilita directivas como *ngIf en el HTML (ej: mostrar el mensaje de error solo si existe)
import { FormsModule } from '@angular/forms'; // FormsModule: habilita [(ngModel)] en el HTML (ej: lo que el usuario escribe en el input se guarda automáticamente en email/password)
import { Router } from '@angular/router'; // Router: permite navegar entre pantallas programáticamente (ej: después del login exitoso, ir a /planetas)

@Component({
  selector: 'app-login',     // nombre con el que se usa este componente en otros HTML
  standalone: true,           // no depende de ningún módulo externo, se autogestiona
  imports: [CommonModule, FormsModule], // módulos que este componente necesita para funcionar
  templateUrl: './login.html',          // archivo HTML que define la pantalla
  styleUrl: './login.scss'              // archivo SCSS con los estilos específicos
})
export class Login {

  // ── Variables del formulario ──────────────────────────
  // Estas variables están enlazadas con los inputs del HTML via [(ngModel)]
  // Cuando el usuario escribe, Angular actualiza estas variables automáticamente

  email: string = '';           // guarda lo que el usuario escribe en el campo email
  password: string = '';        // guarda lo que el usuario escribe en el campo contraseña
  recordarSesion: boolean = false; // guarda si el checkbox "Mantener sesión" está marcado

  // ── Variables de estado de la pantalla ───────────────
  cargando: boolean = false;    // cuando es true, el botón se deshabilita y dice "Verificando..."
  errorMessage: string = '';    // cuando tiene texto, aparece la alerta roja en el HTML

  // ── Usuarios de prueba (mock) ─────────────────────────
  // 🔧 TEMPORAL: simula la base de datos mientras está el backend
  // Cuando el equipo de backend entregue el endpoint de autenticación, esto se reemplaza por:
  // this.authService.login(this.email, this.password).subscribe(respuesta => { ... })
  private usuariosMock = [
    { email: 'zarbon@freezer.empire', password: '1234', rol: 'Comandante de Flota', nombre: 'Zarbon' },
    { email: 'dodoria@freezer.empire', password: '1234', rol: 'Comandante de Flota', nombre: 'Dodoria' },
    { email: 'freezer@freezer.empire', password: '1234', rol: 'Emperador', nombre: 'Freezer' },
  ];

  // Router se inyecta automáticamente — permite usar this.router.navigate() en el código
  constructor(private router: Router) {}

  // ── Método principal: se ejecuta al hacer clic en "Acceder al Sistema" o presionar Enter
  login() {

    // Limpia cualquier error anterior antes de intentar de nuevo
    this.errorMessage = '';

    // Paso 1: validación — si algún campo está vacío, muestra error y no continúa
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingrese su ID de comandante y contraseña.';
      return; // detiene la ejecución aquí
    }

    // Paso 2: activa el estado de carga (deshabilita el botón y cambia su texto)
    this.cargando = true;

    // Paso 3: simula el delay de una llamada al backend (800 milisegundos)
    // 🔧 TEMPORAL: eliminar este setTimeout cuando se integre el backend real
    setTimeout(() => {

      // Busca en el mock si existe un usuario con ese email Y esa contraseña
      const usuario = this.usuariosMock.find(
        u => u.email === this.email && u.password === this.password
      );

      if (usuario) {
        // Paso 4a: login exitoso
        // Guarda los datos del usuario en localStorage para usarlos en otras pantallas
        // (ej: mostrar "Zarbon · Comandante" en el navbar)
        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Redirige automáticamente a la pantalla de planetas
        this.router.navigate(['/planetas']);

      } else {
        // Paso 4b: credenciales incorrectas
        // Muestra el mensaje de error — el HTML lo detecta via *ngIf y lo pinta en rojo
        this.errorMessage = 'Credenciales inválidas. Verifique su ID de comandante.';
      }

      // Paso 5: desactiva el estado de carga sin importar si fue exitoso o no
      this.cargando = false;

    }, 800);
  }
}