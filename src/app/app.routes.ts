import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/layout/layout.component'),
    children: [
      { path: 'login', title: 'Iniciar sesión', loadComponent: () => import('./auth/components/login/login.component'), data: { animation: 'login' } },
      { path: 'register', title: 'Registrarme', loadComponent: () => import('./auth/components/register/register.component'), data: { animation: 'register' } },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' }
];
