// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private usuarioSubject = new BehaviorSubject<any>(null);
  
  constructor(private http: HttpClient) {
    this.carregarUsuarioDoStorage();
  }

  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, senha }, { 
      withCredentials: true 
    }).pipe(
      tap((response: any) => {
        if (response.usuario) {
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
          this.usuarioSubject.next(response.usuario);
        }
      })
    );
  }

  getToken(): string | null {
    // Se estiver usando cookies, o token é enviado automaticamente
    // Se estiver usando localStorage, implemente esta lógica
    return localStorage.getItem('token');
  }

  getUsuarioLogado(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  private carregarUsuarioDoStorage(): void {
    const usuario = this.getUsuarioLogado();
    if (usuario) {
      this.usuarioSubject.next(usuario);
    }
  }

  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.usuarioSubject.next(null);
    
    // Limpar cookie no backend também
    this.http.post(`${this.apiUrl}/logout`, {}, { 
      withCredentials: true 
    }).subscribe();
  }
}