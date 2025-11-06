import { Component } from '@angular/core';
<<<<<<< HEAD
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../guards/auth.service';
=======
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
>>>>>>> main
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ ADICIONE ESTA LINHA
<<<<<<< HEAD
  imports: [CommonModule, FormsModule, RouterLink], // ✅ ADICIONE ESTA LINHA
=======
  imports: [CommonModule, FormsModule], // ✅ ADICIONE ESTA LINHA
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

<<<<<<< HEAD
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
=======
    // Corrige o nome esperado pelo backend para o campo de senha ("senha" em vez de "password")
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
>>>>>>> main
        console.log('✅ Login realizado com sucesso!', response);
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
<<<<<<< HEAD
      error: (error: { error: { mensagem: string; }; }) => {
        console.error('❌ Erro no login:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.mensagem || 'Email ou senha incorretos. Tente novamente.';
      } 
=======
      error: (error) => {
        console.error('❌ Erro no login:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.mensagem || 'Email ou senha incorretos. Tente novamente.';
      }
>>>>>>> main
    });
  }
}