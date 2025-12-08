import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ManagerGuard } from './core/guards/manager.guard';
import { ForgotPasswordComponent } from '../app/app/views/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../app/app/views/auth/reset-password/reset-password.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./views/auth/login/login.component')
      .then(m => m.LoginComponent)
  },
   {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'register',
    loadComponent: () => import('./views/auth/register/register-new.component')
      .then(m => m.RegisterNewComponent)
  },

  // TOP-LEVEL routes — do NOT instantiate DefaultLayout.
  // This avoids the DefaultLayout DI error (missing _SidebarNavHelper)
  // and lets you verify that the actual pages work.
  {
    path: 'tasks',
    loadComponent: () => import('./views/tasks/task-list/task-list.component')
      .then(m => m.TaskListComponent),
    canMatch: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./views/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canMatch: [AuthGuard, ManagerGuard]
  },

  { path: '**', redirectTo: 'login' }
];