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

  // Dashboard
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },

  // =========================
  // PRODUCTS
  // =========================

  // Product list
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/product/products').then(m => m.Products)
  },

  // Create product
  {
    path: 'products/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/product/product-form').then(m => m.ProductForm)
  },

  // Edit product
  {
    path: 'products/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/product/product-form').then(m => m.ProductForm)
  },

  // View product
  {
    path: 'products/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/product/product-detail').then(m => m.ProductDetail)
  },

  // =========================
  // STOCK ENTRIES
  // =========================
  {
    path: 'entries',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/stock-entry/stock-entry').then(m => m.StockEntry)
  },

  // =========================
  // STOCK EXIT
  // =========================
  {
    path: 'exit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/stock-exit/stock-exit').then(m => m.StockExit)
  },

  // =========================
  // ALERTS
  // =========================
  {
    path: 'alerts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/alerts/alerts').then(m => m.Alerts)
  },

  // =========================
  // HISTORIES
  // =========================
  {
    path: 'histories',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/histories/histories').then(m => m.Histories)
  },

  // =========================
  // REPORTS
  // =========================
  {
    path: 'reports',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/reports/reports').then(m => m.Reports)
  },

  // =========================
  // USERS
  // =========================
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/users/user').then(m => m.User)
  },

  // =========================
  // PROFILE
  // =========================
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

  // =========================
  // NOT FOUND
  // =========================
  {
    path: '**',
    redirectTo: 'login'
  }

];
