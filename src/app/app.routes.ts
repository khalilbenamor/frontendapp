// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // Public routes
  {
    path: 'login',
    loadComponent: () => import('./views/auth/login/login.component')
      .then(m => m.LoginComponent),
    data: { title: 'Login' }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/auth/register/register.component')
      .then(m => m.RegisterComponent),
    data: { title: 'Register' }
  },

  // Protected layout – all children require login
  {
    path: '',
    loadComponent: () => import('./layout/default-layout/default-layout.component')
      .then(m => m.DefaultLayoutComponent),
    canMatch: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes')
          .then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'attendance',
        loadChildren: () => import('./views/attendance/routes')
          .then(m => m.ATTENDANCE_ROUTES)
      // Fixed: now uses real constant
      },
      {
        path: 'tasks',
        loadChildren: () => import('./views/tasks/routes')
          .then(m => m.TASK_ROUTES)
      },
      // Fallback inside layout
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Error pages
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component')
      .then(m => m.Page404Component)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];