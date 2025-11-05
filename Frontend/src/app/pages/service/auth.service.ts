// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from '../../../../node_modules/rxjs/dist/types';

export interface User {
  id: number;
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/usuario'; // ✅ URL base correta
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  login(credenciais: { email: string; senha: string }): Observable<any> {
    // ✅ URL correta: /login (não /usuario/login)
    return this.http.post(`${this.apiUrl}/login`, credenciais, {
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        if (response.usuario) { // ✅ backend retorna "usuario" (não "user")
          this.currentUserSubject.next(response.usuario);
        }
      })
    );
  }

  // ... outros métodos
}