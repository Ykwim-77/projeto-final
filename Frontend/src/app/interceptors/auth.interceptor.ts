import { HttpInterceptorFn } from '@angular/common/http';

/**
 * 🔐 INTERCEPTOR DE AUTENTICAÇÃO
 * 
 * Este interceptor adiciona automaticamente `withCredentials: true` 
 * em TODAS as requisições HTTP para que os cookies sejam enviados
 * automaticamente para o backend.
 * 
 * COMO FUNCIONA:
 * 1. Angular intercepta todas as requisições HTTP
 * 2. Adiciona { withCredentials: true } nas opções
 * 3. Isso permite que cookies (como o token) sejam enviados automaticamente
 * 4. O backend recebe o cookie e pode validar o token
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clona a requisição e adiciona withCredentials: true
  const reqWithCredentials = req.clone({
    withCredentials: true // 👈 Permite envio de cookies
  });

  return next(reqWithCredentials);
};

