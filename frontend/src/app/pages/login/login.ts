import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ ADICIONE ESTA LINHA
  imports: [CommonModule, FormsModule], // ✅ ADICIONE ESTA LINHA
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  fazerLogin() {
    throw new Error('Method not implemented.');
  }
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
    
    const form = event.target as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

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
      }
    });
  }
}