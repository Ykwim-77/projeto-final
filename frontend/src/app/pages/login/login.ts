import { Component } from '@angular/core';
import { Router } from '@angular/router';
<<<<<<< HEAD
import { AuthService } from '../../services/auth.service';
=======
import { AuthService } from '../../services/auth.service'; // ✅ CORREÇÃO: usar o serviço correto
>>>>>>> main
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
<<<<<<< HEAD
  standalone: true, // ✅ ADICIONE ESTA LINHA
  imports: [CommonModule, FormsModule], // ✅ ADICIONE ESTA LINHA
=======
  standalone: true,
  imports: [CommonModule, FormsModule],
>>>>>>> main
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
<<<<<<< HEAD
  fazerLogin() {
    throw new Error('Method not implemented.');
  }
=======
>>>>>>> main
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
      password: this.password ? '***' : 'vazio'
    });

    // Validação básica
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

<<<<<<< HEAD
    // Corrige o nome esperado pelo backend para o campo de senha ("senha" em vez de "password")
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('✅ Login realizado com sucesso!', response);
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('❌ Erro no login:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.mensagem || 'Email ou senha incorretos. Tente novamente.';
=======
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('✅ Login bem-sucedido - Navegando para home');
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('❌ Erro no login (LoginComponent):', {
          fullErrorObject: error,
        });
        this.isLoading = false;
        // Exibe mensagem de erro padronizada do backend (espera que seja { mensagem: ... })
        if (error && error.mensagem) {
          this.errorMessage = error.mensagem;
        } else {
          this.errorMessage = 'Erro de conexão com o servidor. Verifique sua conexão ou tente novamente.';
        }
        console.log('📢 Mensagem de erro para usuário:', this.errorMessage);
>>>>>>> main
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