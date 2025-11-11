import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ✅ CORREÇÃO: usar o serviço correto
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    
    console.log('🔄 Iniciando login...', {
      email: this.email,
      password: this.password ? '*' : 'vazio'
    });

    // Validação básica
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Corrige o nome esperado pelo backend para o campo de senha ("senha" em vez de "password")
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('✅ Login bem-sucedido - Navegando para home');
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        // Mostra o erro detalhado no console
        console.error('❌ Erro no login (LoginComponent):', error, JSON.stringify(error));
        this.isLoading = false;
        // Tenta exibir a mensagem de erro mais útil possível para o usuário
        if (error?.mensagem) {
          this.errorMessage = error.mensagem;
        } else if (error?.error?.mensagem) {
          this.errorMessage = error.error.mensagem;
        } else if (typeof error === 'string') {
          this.errorMessage = error;
        } else if (error?.error) {
          this.errorMessage = JSON.stringify(error.error);
        } else {
          this.errorMessage = 'Erro desconhecido no login. Veja detalhes no console do navegador.';
        }
        console.log('📢 Mensagem de erro para usuário:', this.errorMessage);
      }
    });
  }

  // Método para testar com dados específicos
  preencherTeste() {
    this.email = 'admin@example.com';
    this.password = '123456';
    console.log('🧪 Credenciais de teste preenchidas');
  }

  // Limpar erro ao alterar campos
  onInputChange(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
}