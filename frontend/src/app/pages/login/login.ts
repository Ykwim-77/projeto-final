// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/AuthService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('🚀 Enviando dados de login para o servidor...');

    this.authService.login({ email: this.email, senha: this.senha }).subscribe({
      next: (res) => {
        console.log('✅ Login bem-sucedido:', res);
        this.isLoading = false;

        // Redireciona para home (ou outra rota autenticada)
        this.router.navigate(['/home'])
          .then(success => {
            if (success) {
              console.log('🎉 Navegação para HOME bem-sucedida!');
            } else {
              console.error('❌ Falha ao navegar para HOME.');
              this.listarRotasConfiguradas();
            }
          })
          .catch(error => {
            console.error('💥 Erro na navegação:', error);
            this.listarRotasConfiguradas();
          });
      },
      error: (err) => {
        console.error('❌ Erro no login:', err);
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Falha no login. Tente novamente.';
      }
    });
  }
fazerLogin(event?: Event): void {
  this.onSubmit(event);
}
  private listarRotasConfiguradas(): void {
    console.log('🔍 Rotas configuradas no Router:', this.router.config);
  }
}
