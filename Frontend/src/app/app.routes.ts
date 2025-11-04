import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  { 
    path: 'cadastro', 
    loadComponent: () => import('./pages/cadastro/cadastro').then(m => m.CadastroComponent)
  },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
  { 
    path: 'produtos', 
    loadComponent: () => import('./pages/produtos/produtos').then(m => m.ProdutosComponent)
  },
  //{ path: '**', redirectTo: '/login' }
];