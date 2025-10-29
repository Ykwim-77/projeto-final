// src/app/pages/cadastro/cadastro.ts (ou cadastro.component.ts)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  isLoading: boolean = false;

  constructor(private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    console.log('Cadastro:', {
      nome: this.nome,
      email: this.email,
      password: this.password
    });
  }

  // Método para voltar ao login
  goToLogin() {
    this.router.navigate(['/login']);
  }
}