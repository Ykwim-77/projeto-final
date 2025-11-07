import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api'; // Ajuste para sua URL da API

  constructor(private http: HttpClient) { }

  // Adicione estes métodos que estão faltando:
  verificarCodigo(codigo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verificar-codigo`, { codigo });
  }

  reenviarCodigo(): Observable<any> {
    return this.http.post(`${this.apiUrl}/reenviar-codigo`, {});
  }

  // Seus métodos existentes...
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}