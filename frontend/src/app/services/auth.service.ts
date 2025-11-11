import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map, throwError } from 'rxjs';
import { environment } from '../environments/environment';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  id_usuario: number;
  nome: string;
  email: string;
  id_tipo_usuario: number;
  token?: string;
}

export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  id_tipo_usuario: number;
  ativo: boolean;
  CPF?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/usuario`;
  private readonly TOKEN_KEY = 'progest_token';
  private readonly USER_KEY = 'progest_user';

  constructor(private http: HttpClient) {}
  
  login(email: string, password: string): Observable<any> {
    console.log(this.apiUrl)
    console.log('📤 Enviando login para:', `${this.apiUrl}/login`);
    return this.http.post<any>(
      `${this.apiUrl}/login`,
      {
        email: email.trim().toLowerCase(),
        senha: password
      },
      { withCredentials: true }
    ).pipe(
      tap((response) => {
        console.log('📥 Resposta completa:', response);
        if (response.usuario) {
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.usuario));
          console.log('✅ Usuário salvo no localStorage');
        }
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }
      }),
      catchError((error: any) => {
        let mensagem = 'Erro desconhecido';
        if (error?.error && typeof error.error === 'object' && error.error.mensagem) {
          mensagem = error.error.mensagem;
        } else if (error?.error && typeof error.error === 'string') {
          mensagem = error.error;
        } else if (error?.message) {
          mensagem = error.message;
        }
        return throwError(() => ({ mensagem }));
      })
    );
  }

  logout(): void {
    // Limpa dados locais
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    // Caso tenha endpoint de logout, descomente:
    // this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
    //   .subscribe(() => console.log('Cookie limpo no backend'));
    console.log('Logout realizado (dados locais limpos)');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getToken(): string | null {
    // Lê do localStorage o token JWT
    return localStorage.getItem(this.TOKEN_KEY);
  }

  validateToken(): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}`, { withCredentials: true }).pipe(
      tap(() => console.log('✅ Token válido - usuário autenticado')),
      map(() => true),
      catchError((error) => {
        if (error.status === 401) {
          console.log('❌ Token inválido ou expirado');
          localStorage.removeItem(this.USER_KEY);
          localStorage.removeItem(this.TOKEN_KEY);
          return of(false);
        }
        console.error('Erro ao validar token:', error);
        return of(false);
      })
    );
  }

  getUsuarioLogado(): Usuario | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Erro ao fazer parse do usuário:', e);
        return null;
      }
    }
    return null;
  }

  criarUsuario(dados: {
    nome: string;
    email: string;
    senha: string;
    CPF?: string;
    id_tipo_usuario?: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, dados);
  }

  // Caso queira suporte para cookie httpOnly do backend:
  // private getCookie(name: string): string | null {
  //   const nameEQ = name + "=";
  //   const ca = document.cookie.split(';');
  //   for (let i = 0; i < ca.length; i++) {
  //     let c = ca[i];
  //     while (c.charAt(0) === ' ') c = c.substring(1, c.length);
  //     if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  //   }
  //   return null;
  // }
}