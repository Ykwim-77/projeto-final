import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/usuario/login'; // URL do backend

  constructor(private http: HttpClient) {}

  login(dados: { email: string, senha: string }) {
    // Faz o POST /login, enviando email e senha
    return this.http.post(`${this.apiUrl}/login`, dados, { withCredentials: true });
  }

  perfil() {
    // Faz GET /perfil, que só funciona se o cookie JWT estiver válido
    return this.http.get(`${this.apiUrl}/perfil`, { withCredentials: true });
  }

  logout() {
    // Faz POST /logout pra apagar o cookie
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }
}
