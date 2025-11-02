// src/app/pages/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  onSubmit(p0: any) {
    throw new Error('Method not implemented.');
  }
  password(password: any) {
    throw new Error('Method not implemented.');
  }
  email: string = '';
  senha: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  fazerLogin(event?: Event): void { // ✅ Removeu o parâmetro 'credenciais'
    if (event) {
      event.preventDefault();
    }

    // Validação básica
    if (!this.email || !this.senha) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({
      email: this.email,
      senha: this.senha // ✅ Agora usa a propriedade da classe
    }).subscribe({
      next: (res) => {
        console.log('✅ Login bem-sucedido:', res);
        this.isLoading = false;
        
        // Redireciona para home
        this.router.navigate(['/home']).then(success => {
          if (!success) {
            console.error('❌ Rota home não encontrada');
          }
        });
      },
      error: (err) => {
        console.error('❌ Erro no login:', err);
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erro ao fazer login. Tente novamente.';
      }
    });
  }
}