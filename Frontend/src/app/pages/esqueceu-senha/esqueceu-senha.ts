import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../guards/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-esqueceu-senha',
  imports: [CommonModule, FormsModule],
  templateUrl: './esqueceu-senha.html',
  styleUrl: './esqueceu-senha.scss',
})
export class EsqueceuSenhaComponent {
  email: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (form.checkValidity()) {
      this.router.navigate(['/codigo-verificacao']);
      return;
    }

    if (!this.email) {
      this.errorMessage = 'Por favor, preencha o campo de E-mail';
      return;
    }

    form.reportValidity();
  }
}
