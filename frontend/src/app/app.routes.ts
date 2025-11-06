import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { CadastroComponent } from './pages/cadastro/cadastro';
import { HomeComponent } from './pages/home/home';
import { ProdutosComponent } from './pages/produtos/produtos';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'home', component: HomeComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: '*', redirectTo: '/login' }

];