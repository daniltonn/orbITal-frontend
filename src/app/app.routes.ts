// ──────────────────────────────────────────────────────────
// app.routes.ts — Define las rutas de navegación del sistema
// Cada ruta conecta una URL con su pantalla correspondiente
// ──────────────────────────────────────────────────────────

// Routes: tipo de Angular que define el arreglo de rutas
import { Routes } from '@angular/router';
// Se importa cada pantalla que tenga una ruta asignada
import { Login } from './pages/login/login';
import { RegistroUsuario } from './pages/registro-usuario/registro-usuario';

export const routes: Routes = [
  // Si el usuario entra a la raíz "/" lo redirige automáticamente a "/login"
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta del login — muestra la pantalla Login cuando la URL es /login
  { path: 'login', component: Login },

  // Ruta de registro de usuario (solo admin)
  { path: 'registrar-usuario', component: RegistroUsuario },
  
  // 🔧 PENDIENTE: agregar las demás rutas del MVP a medida que se implementen
  // { path: 'planetas', component: Listar },
  // { path: 'planetas/registrar', component: Registrar },
  // { path: 'equipos/registrar', component: RegistrarEquipo },
  // { path: 'misiones/asignar', component: Asignar },
  // { path: 'misiones/:id', component: Estado },
];