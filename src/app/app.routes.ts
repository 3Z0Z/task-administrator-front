import { Routes } from '@angular/router';

import { isNotAuthGuard } from './guards/is-not-auth.guard';
import { isAuthGuard } from './guards/is-auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [isNotAuthGuard],
    loadComponent: () => import('./auth/layout/layout.component'),
    children: [
      { path: 'login', title: 'Iniciar sesión', loadComponent: () => import('./auth/components/login/login.component'), data: { animation: 'login' } },
      { path: 'register', title: 'Registrarme', loadComponent: () => import('./auth/components/register/register.component'), data: { animation: 'register' } },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'home',
    canActivate: [isAuthGuard],
    loadComponent: () => import('./home/layout/home-layout/home-layout.component'),
    children: [
      { path: '', title: 'Inicio', loadComponent: () => import('./home/pages/home/home.component') },
      { path: 'project/:projectId', loadComponent: () => import('./home/pages/project/project.component') }
    ]
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' }
];
