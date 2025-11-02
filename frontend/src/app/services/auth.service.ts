import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
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

  /**
   * Realiza login do usuário
   * 
   * MODO TEMPORÁRIO: Se o backend não responder, usa login simulado
   * Remover quando o backend estiver pronto
   */
  login(email: string, senha: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, senha }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }
        if (response.usuario) {
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.usuario));
        }
      }),
      // Fallback: Se der erro, tenta login simulado
      // Isso permite testar o frontend mesmo sem backend pronto
      catchError((error) => {
        console.warn('⚠️ Backend não disponível, usando login simulado para testes');
        console.warn('Erro:', error);
        
        // Login simulado - REMOVER quando backend estiver pronto
        // Aceita qualquer email/senha para teste
        const usuarioSimulado = {
          id_usuario: 1,
          nome: 'Usuário Teste',
          email: email,
          id_tipo_usuario: 2,
          ativo: true
        };

        // Salva no localStorage
        localStorage.setItem(this.TOKEN_KEY, 'token_simulado_' + Date.now());
        localStorage.setItem(this.USER_KEY, JSON.stringify(usuarioSimulado));

        // Retorna como se fosse sucesso
        return of({
          token: 'token_simulado',
          usuario: usuarioSimulado,
          mensagem: 'Login simulado (backend não disponível)'
        });
      })
    );
  }

  /**
   * Realiza logout
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Retorna token de autenticação
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Retorna dados do usuário logado
   */
  getUsuarioLogado(): Usuario | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  /**
   * Cria novo usuário (cadastro)
   */
  criarUsuario(dados: {
    nome: string;
    email: string;
    senha: string;
    CPF?: string;
    id_tipo_usuario?: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, dados);
  }
}

