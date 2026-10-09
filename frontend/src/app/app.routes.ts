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
  // DASHBOARD
  // =========================
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },

  // =========================
  // MAIN MENU
  // =========================

  // Products
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
    path: 'products/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/product/product-form').then(m => m.ProductForm)
  },
  {
    path: 'products/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/product/product-detail').then(m => m.ProductDetail)
  },

  // Categories
  {
    path: 'categories',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/categories/categories').then(m => m.Categories)
  },

  // Products by category
  {
    path: 'categories/:id/products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/categories/category-products')
        .then(m => m.CategoryProducts)
  },

  // =========================
  // STOCK MANAGEMENT
  // =========================

  // Warehouses
  {
    path: 'warehouses',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/warehouses/warehouses').then(m => m.Warehouses)
  },

  // Stock Entries
  {
    path: 'entries',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/stock-entry/stock-entry').then(m => m.StockEntry)
  },

  // Stock Exits
  {
    path: 'exit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/stock-exit/stock-exit').then(m => m.StockExit)
  },

  // Transfers
  {
    path: 'transfers',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/transfers/transfers').then(m => m.Transfers)
  },

  // Stock Alerts
  {
    path: 'alerts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/alerts/alerts').then(m => m.Alerts)
  },

  // =========================
  // MANAGEMENT
  // =========================

  // Suppliers
  {
    path: 'suppliers',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/suppliers/suppliers').then(m => m.Suppliers)
  },

  // Users
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/users/user').then(m => m.User)
  },

  // Stock History
  {
    path: 'histories',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/histories/histories').then(m => m.Histories)
  },

  // Reports
  {
    path: 'reports',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/reports/reports').then(m => m.Reports)
  },

  // Audit Logs
  {
    path: 'audit-logs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/audit-logs/audit-logs').then(m => m.AuditLogs)
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
