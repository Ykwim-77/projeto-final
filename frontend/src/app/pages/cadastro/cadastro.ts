// src/app/pages/cadastro/cadastro.ts (ou cadastro.component.ts)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.scss']
})
export class CadastroComponent {
  nome: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  cpf: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
    }

    // Validações
    if (!this.nome || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'A senha deve ter no mínimo 6 caracteres';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const dadosCadastro = {
      nome: this.nome,
      email: this.email,
      senha: this.password, // Backend espera 'senha', não 'password'
      CPF: this.cpf || undefined,
      id_tipo_usuario: 2 // 2 = usuário comum (1 seria admin)
    };

    this.authService.criarUsuario(dadosCadastro).subscribe({
      next: (response) => {
        console.log('✅ Cadastro realizado com sucesso!', response);
        this.isLoading = false;
        this.successMessage = 'Conta criada com sucesso! Redirecionando para login...';
        
        // Aguarda 2 segundos e redireciona para login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Erro no cadastro:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.mensagem || 'Erro ao criar conta. Tente novamente.';
      }
    });
  }

  // Método para voltar ao login
  goToLogin() {
    this.router.navigate(['/login']);
  }
}