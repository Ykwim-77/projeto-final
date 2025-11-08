import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../guards/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-esqueceu-senha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './esqueceu-senha.html',
  styleUrls: ['./esqueceu-senha.scss'],
})
export class EsqueceuSenhaComponent {
  email: string = '';
  errorMessage: string = '';
  currentStep = 0; // 👈 Passo atual (1ª tela)

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (!this.email) {
      this.errorMessage = 'Por favor, preencha o campo de E-mail';
      return;
    }

    if (form.checkValidity()) {
      // Quando for para a próxima página:
      this.currentStep = 1; // 👈 Atualiza indicador
      this.router.navigate(['/codigo-verificacao']);
    }
  }
}
