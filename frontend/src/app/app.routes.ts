import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // =========================
  // PUBLIC
  // =========================
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },

  // =========================
  // PROTECTED
  // =========================
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },

  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/product/products').then(m => m.Products)
  },

  {
    path: 'products/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/product/product-form').then(m => m.ProductForm)
  },

  {
    path: 'entries',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/stock-entry/stock-entry').then(m => m.StockEntry)
  },

  {
    path: 'exit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/stock-exit/stock-exit').then(m => m.StockExit)
  },

  {
    path: 'alerts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/alerts/alerts').then(m => m.Alerts)
  },

  {
    path: 'histories',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/histories/histories').then(m => m.Histories)
  },

  {
    path: 'reports',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/reports/reports').then(m => m.Reports)
  },

  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/users/user').then(m => m.User)
  },

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile').then(m => m.Profile)
  },

  // =========================
  // DEFAULT
  // =========================
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
