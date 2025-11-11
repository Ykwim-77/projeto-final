import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../guards/auth.service';
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

  irParaEsqueceuSenha(event: Event) {
    event.preventDefault(); // evita comportamento padrão do <a>

    this.isLoading = true; // mostra overlay de loading

    // Pequeno delay para o loading aparecer antes da navegação
    setTimeout(() => {
      this.router.navigate(['/esqueceu-senha']); // vai para a próxima tela
    }, 1500);
  }


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

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('✅ Login bem-sucedido - Navegando para home');
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('❌ Erro no login:', {
          status: error?.status,
          message: error?.message,
          error: error?.error
        });
        
        this.isLoading = false;
        
        // Tratamento robusto de diferentes formatos de erro
        if (error?.error?.mensagem) {
          this.errorMessage = error.error.mensagem;
        } else if (error?.message) {
          this.errorMessage = error.message;
        } else if (typeof error === 'string') {
          this.errorMessage = error;
        } else {
          this.errorMessage = 'Erro de conexão com o servidor';
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