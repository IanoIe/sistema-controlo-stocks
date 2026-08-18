import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/product/products').then(m => m.Products)
  },
  {
    path: 'entries',
    loadComponent: () =>
      import('./pages/stock-entry/stock-entry').then(m => m.StockEntry)
  },
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
