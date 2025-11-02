import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioLogado = new BehaviorSubject<any>(null);
  
  // Usuário mock para teste
  private usuarioMock = {
    nome: 'João Silva',
    email: 'joao.silva@empresa.com'
  };

  constructor(private router: Router) {
    // Verifica se há usuário no localStorage ao inicializar
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
      this.usuarioLogado.next(JSON.parse(usuarioSalvo));
    }
  }

  login(email: string, password: string): Observable<any> {
    // Simulação de login
    return of({ 
      success: true, 
      usuario: this.usuarioMock 
    }).pipe(
      delay(1000),
      tap(response => {
        if (response.success) {
          this.usuarioLogado.next(response.usuario);
          localStorage.setItem('usuarioLogado', JSON.stringify(response.usuario));
        }
      })
    );
  }

  logout(): void {
    this.usuarioLogado.next(null);
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }

  getUsuarioLogado(): any {
    return this.usuarioLogado.value;
  }

  isLoggedIn(): boolean {
    return this.usuarioLogado.value !== null;
  }
}