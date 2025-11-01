// src/app/pages/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
    }

    console.log('🚀 Tentando fazer login...');
    this.isLoading = true;

    setTimeout(() => {
      console.log('✅ Login simulado realizado');
      this.isLoading = false;
      
      // Tenta navegar para home
      this.router.navigate(['/home'])
        .then(success => {
          if (success) {
            console.log('🎉 Navegação para HOME bem-sucedida!');
          } else {
            console.error('❌ Navegação falhou - rota não encontrada');
            this.verificarProblemasRota();
          }
        })
        .catch(error => {
          console.error('💥 Erro na navegação:', error);
          this.verificarProblemasRota();
        });
    }, 2000);
  }

  private verificarProblemasRota(): void {
    console.log('🔍 Verificando problemas de rota...');
    console.log('📍 URL atual:', window.location.href);
    
    // Verifica se a rota home existe no router
    this.router.config.forEach(route => {
      console.log('📋 Rota configurada:', route.path, route.component?.name);
    });
  }
}