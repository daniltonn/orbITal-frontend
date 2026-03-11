import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'app/planetas/listar',
    pathMatch: 'full'
  },
  {
    path: 'app',
    children: [
      {
        path: 'planetas/listar',
        loadComponent: () =>
          import('./pages/planetas/listar/listar').then(m => m.ListarComponent)
      },
      {
        path: 'equipos/registrar',
        loadComponent: () =>
          import('./pages/equipos/registrar/registrar').then(m => m.RegistrarEquipoComponent)
      },
      { path: '**', redirectTo: 'app/planetas/listar' }
    ]
  }
];