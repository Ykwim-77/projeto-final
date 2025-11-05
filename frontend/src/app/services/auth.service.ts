import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
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
   * 🔐 Realiza login do usuário
   * 
   * FLUXO:
   * 1. Envia credenciais para o backend
   * 2. Backend valida e cria JWT token
   * 3. Backend salva token em cookie httpOnly (seguro)
   * 4. Cookie é enviado automaticamente em requisições futuras
   * 
   * withCredentials: true permite que cookies sejam enviados/recebidos
   */
  login(email: string, senha: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/login`, 
      { email, senha },
      { withCredentials: true } // 👈 Permite envio/recebimento de cookies
    ).pipe(
      tap(response => {
        // Backend salva token em cookie, não precisamos salvar manualmente
        // Mas podemos salvar dados do usuário se necessário
        if (response.usuario) {
          // Opcional: salvar dados do usuário localmente para acesso rápido
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.usuario));
        }
        console.log('✅ Login realizado com sucesso');
      }),
      catchError((error) => {
        console.error('❌ Erro no login:', error);
        throw error; // Propaga o erro para o componente tratar
      })
    );
  }

  /**
   * 🚪 Realiza logout
   * 
   * IMPORTANTE: Cookie httpOnly não pode ser deletado por JavaScript!
   * 
   * O que faz:
   * 1. Limpa dados locais (localStorage)
   * 2. (Opcional) Faz requisição ao backend para limpar cookie
   * 
   * NOTA: Para limpar o cookie completamente, crie um endpoint /logout
   * no backend que limpe o cookie usando res.clearCookie('token')
   */
  logout(): void {
    // Limpa dados locais
    localStorage.removeItem(this.USER_KEY);
    
    // TODO: Implementar quando backend tiver endpoint de logout
    // this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
    //   .subscribe(() => console.log('Cookie limpo no backend'));
    
    console.log('Logout realizado (dados locais limpos)');
  }

  /**
   * ✅ Verifica se usuário está autenticado
   * 
   * Verifica se existe token no cookie (não no localStorage)
   * Se o cookie existir, o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  /**
   * 🔑 Retorna token de autenticação
   * 
   * Lê o token do cookie (não do localStorage)
   * O cookie é definido pelo backend com nome "token"
   */
  getToken(): string | null {
    // O backend salva o token em um cookie chamado "token"
    return this.getCookie('token');
  }

  /**
   * ✅ Valida se o token atual ainda é válido
   * 
   * Faz uma requisição a uma rota protegida do backend.
   * Se a requisição for bem-sucedida (200), o token é válido.
   * Se retornar 401, o token é inválido/expirado.
   * 
   * FLUXO:
   * 1. Faz GET em rota que requer autenticação (authMiddleware)
   * 2. Backend lê cookie "token" automaticamente
   * 3. Backend valida JWT usando jwt.verify()
   * 4. Se válido: retorna 200 → token válido ✅
   * 5. Se inválido: retorna 401 → token inválido/expirado ❌
   * 
   * ÚTIL PARA:
   * - Verificar se usuário ainda está logado
   * - Atualizar sessão antes de expirar
   * - Detectar se token expirou
   */
  validateToken(): Observable<boolean> {
    // Usa rota GET "/" que requer authMiddleware
    // Se token for válido, retorna sucesso (200)
    // Se token for inválido/expirado, retorna 401
    return this.http.get<any>(`${this.apiUrl}`, { withCredentials: true }).pipe(
      // Se chegou aqui, token é válido
      tap(() => console.log('✅ Token válido - usuário autenticado')),
      // Converte resposta em boolean (true = válido)
      map(() => true),
      catchError((error) => {
        if (error.status === 401) {
          console.log('❌ Token inválido ou expirado');
          // Limpa dados locais se token for inválido
          localStorage.removeItem(this.USER_KEY);
          return of(false); // Token inválido
        }
        // Outros erros (500, etc) - não sabemos se token é válido
        console.error('Erro ao validar token:', error);
        return of(false);
      })
    );
  }

  /**
   * Lê um cookie pelo nome
   */
  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  /**
   * Retorna dados do usuário logado
   */
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

