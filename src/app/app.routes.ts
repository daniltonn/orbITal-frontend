// ──────────────────────────────────────────────────────────
// app.routes.ts — Define las rutas de navegación del sistema
// Cada ruta conecta una URL con su pantalla correspondiente
// ──────────────────────────────────────────────────────────

import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { RegistroUsuario } from './pages/registro-usuario/registro-usuario/registro-usuario';
import { RegistrarPlaneta } from './pages/planetas/registrar/registrar';
import { ListarComponent } from './pages/planetas/listar/listar';
import { RegistrarEquipoComponent } from './pages/equipos/registrar/registrar';
import { AsignarMision } from './pages/misiones/asignar/asignar';
import { EstadoMision } from './pages/misiones/estado/estado';
import { ListarUsuariosComponent } from './pages/listar-usuarios/listar-usuarios';

export const routes: Routes = [

  // Ruta raíz
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  { path: 'login', component: Login },

  // Registro de usuario
  { path: 'registrar-usuario', component: RegistroUsuario },

  //Lista de usuarios
  {path: 'usuarios', component: ListarUsuariosComponent},

  // Registrar planeta
  { path: 'planetas/registrar', component: RegistrarPlaneta },

  // Listar planetas
  { path: 'planetas', component: ListarComponent },

  // Registrar equipo
  { path: 'equipos/registrar', component: RegistrarEquipoComponent },

  // Asignar misión
  { path: 'misiones/asignar', component: AsignarMision },

  // Estado misión
  { path: 'misiones/estado', component: EstadoMision },

  // Ruta comodín
  { path: '**', redirectTo: 'login' }
];