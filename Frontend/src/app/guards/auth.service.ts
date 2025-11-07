import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient) {}

  // MÉTODO LOGIN CORRIGIDO - deve retornar Observable
  login(email: string, password: string): Observable<any> {
    // Implementação real (quando tiver a API)
    /*
    return this.http.post('/api/auth/login', { 
      email: email,
      password: password 
    });
    */

    // SIMULAÇÃO TEMPORÁRIA para teste
    return new Observable(observer => {
      setTimeout(() => {
        // Simula credenciais válidas
        if (email === 'teste@email.com' && password === '123456') {
          observer.next({
            success: true,
            token: 'token_jwt_simulado',
            user: {
              id: 1,
              name: 'Usuário Teste',
              email: email
            },
            mensagem: 'Login realizado com sucesso'
          });
        } else {
          observer.error({
            error: {
              mensagem: 'Email ou senha incorretos'
            }
          });
        }
        observer.complete();
      }, 1500);
    });
  }

  // Método de verificação de código (do código anterior)
  verificarCodigo(codigo: string): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        if (codigo === '123456') {
          observer.next({
            success: true,
            token: 'token_temporario_' + codigo,
            message: 'Código verificado com sucesso'
          });
        } else {
          observer.error({
            error: 'Código inválido',
            message: 'O código digitado não é válido. Use 123456 para teste.'
          });
        }
        observer.complete();
      }, 1500);
    });
  }

  reenviarCodigo(): Observable<any> {
    return of({ 
      success: true, 
      message: 'Código reenviado com sucesso' 
    }).pipe(delay(1000));
  }
}