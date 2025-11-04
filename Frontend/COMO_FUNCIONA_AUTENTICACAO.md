# 🔐 Como Funciona a Verificação de Token - Explicação Completa

## 📋 Visão Geral

Este documento explica **passo a passo** como funciona o sistema de autenticação com tokens JWT usando cookies.

---

## 🎯 Fluxo Completo de Autenticação

### 1️⃣ **LOGIN** (Usuário faz login)

```
Frontend (login.ts)
    ↓
Envia: { email, senha }
    ↓
Backend (/usuario/login)
    ↓
Valida credenciais no banco
    ↓
Gera JWT token com jwt.sign()
    ↓
Salva token em cookie httpOnly
    ↓
Retorna: { usuario: {...} }
```

**Código no Backend:**
```javascript
// Gera token JWT
const token = jwt.sign(
  { email: usuario.email, senha: usuario.senha_hash },
  process.env.JWT_SECRET || 'segredo',
  { expiresIn: '1h' } // Token expira em 1 hora
);

// Salva em cookie httpOnly (seguro - não pode ser acessado por JavaScript)
res.cookie("token", token, {
  httpOnly: true,    // 👈 Cookie não pode ser lido por JavaScript
  secure: true,      // 👈 Apenas HTTPS em produção
  sameSite: "strict", // 👈 Proteção contra CSRF
  maxAge: 3600000    // 👈 Expira em 1 hora
});
```

**Código no Frontend:**
```typescript
login(email: string, senha: string) {
  return this.http.post(`${this.apiUrl}/login`, { email, senha }, {
    withCredentials: true // 👈 Permite envio/recebimento de cookies
  });
}
```

---

### 2️⃣ **REQUISIÇÕES AUTENTICADAS** (Após login)

```
Frontend faz requisição
    ↓
Interceptor adiciona withCredentials: true automaticamente
    ↓
Navegador envia cookie "token" automaticamente
    ↓
Backend recebe requisição
    ↓
authMiddleware lê cookie "token"
    ↓
jwt.verify() valida o token
    ↓
Se válido: continua para controller ✅
Se inválido: retorna 401 ❌
```

**Interceptor (auth.interceptor.ts):**
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Adiciona withCredentials em TODAS as requisições
  const reqWithCredentials = req.clone({
    withCredentials: true // 👈 Permite envio de cookies
  });
  return next(reqWithCredentials);
};
```

**Middleware no Backend (authController.js):**
```javascript
const authMiddleware = (req, res, next) => {
  // Lê cookie "token" automaticamente
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    // Valida e decodifica o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo');
    
    // Adiciona dados do usuário no request
    req.usuario = decoded;
    
    next(); // ✅ Token válido, continua
  } catch (error) {
    // ❌ Token inválido ou expirado
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

---

### 3️⃣ **VERIFICAÇÃO DE TOKEN** (Validar se token ainda é válido)

```typescript
// No AuthService
validateToken(): Observable<boolean> {
  // Faz requisição a rota protegida
  return this.http.get(`${this.apiUrl}`, { withCredentials: true }).pipe(
    map(() => true),  // ✅ Se sucesso (200), token é válido
    catchError((error) => {
      if (error.status === 401) {
        // ❌ Token inválido ou expirado
        return of(false);
      }
      return of(false);
    })
  );
}
```

**Como usar:**
```typescript
// Verificar se token é válido
this.authService.validateToken().subscribe(isValid => {
  if (isValid) {
    console.log('Usuário está autenticado');
  } else {
    console.log('Token expirado, redirecionar para login');
    this.router.navigate(['/login']);
  }
});
```

---

## 🔑 Conceitos Importantes

### **1. Cookies httpOnly**
- **Segurança**: Cookies `httpOnly: true` não podem ser lidos por JavaScript
- **Vantagem**: Protege contra ataques XSS (Cross-Site Scripting)
- **Desvantagem**: JavaScript não consegue acessar diretamente
- **Solução**: Usamos `document.cookie` apenas para verificar se existe, não para ler o valor completo

### **2. withCredentials: true**
- **O que é**: Permite que cookies sejam enviados/recebidos automaticamente
- **Necessário**: Sim, porque cookies só são enviados se essa opção estiver ativa
- **Onde**: Em TODAS as requisições HTTP (por isso usamos interceptor)

### **3. JWT (JSON Web Token)**
- **Estrutura**: `header.payload.signature`
- **Payload**: Dados do usuário (email, senha_hash, etc)
- **Validação**: Backend verifica assinatura usando `JWT_SECRET`
- **Expiração**: Token tem tempo de vida (1 hora no seu caso)

### **4. Middleware de Autenticação**
- **Função**: Intercepta requisições ANTES de chegar no controller
- **Verifica**: Se token existe e é válido
- **Ação**: Se válido → continua, Se inválido → retorna 401

---

## 📁 Estrutura de Arquivos

```
frontend/
├── src/app/
│   ├── services/
│   │   └── auth.service.ts          # Serviço de autenticação
│   ├── interceptors/
│   │   └── auth.interceptor.ts       # Adiciona withCredentials automaticamente
│   └── app.config.ts                 # Registra interceptor
│
backend/
├── src/
│   ├── midllewares/
│   │   └── authController.js         # Valida token JWT
│   ├── controllers/
│   │   └── user-controller.js        # Gera token no login
│   └── routes/
│       └── user-routes.js            # Aplica middleware em rotas protegidas
```

---

## 🎓 Exemplo Prático Completo

### **Cenário: Usuário acessa página protegida**

1. **Usuário faz login:**
   ```typescript
   this.authService.login('email@exemplo.com', 'senha123')
     .subscribe(response => {
       // Token foi salvo em cookie automaticamente pelo backend
       // Cookie não pode ser lido por JavaScript (httpOnly)
       console.log('Login realizado!');
     });
   ```

2. **Usuário tenta acessar página protegida:**
   ```typescript
   // Verifica se está autenticado
   if (this.authService.isAuthenticated()) {
     // Cookie existe, mas vamos validar se ainda é válido
     this.authService.validateToken().subscribe(isValid => {
       if (isValid) {
         // Token válido, pode acessar
         this.loadPageContent();
       } else {
         // Token expirado, redireciona para login
         this.router.navigate(['/login']);
       }
     });
   }
   ```

3. **Backend recebe requisição:**
   ```javascript
   // authMiddleware verifica automaticamente
   // Se token válido → continua
   // Se token inválido → retorna 401
   ```

---

## ⚠️ Pontos de Atenção

1. **Cookie httpOnly não pode ser deletado por JavaScript**
   - Para logout, precisa criar endpoint no backend que limpa o cookie

2. **Token expira em 1 hora**
   - Após expirar, usuário precisa fazer login novamente
   - Pode implementar refresh token para renovar automaticamente

3. **CORS precisa configurar `credentials: true`**
   - Backend já está configurado corretamente

4. **Interceptor adiciona `withCredentials` em TODAS as requisições**
   - Isso é necessário para cookies funcionarem

---

## 🚀 Próximos Passos

1. **Criar endpoint de logout** no backend para limpar cookie
2. **Implementar refresh token** para renovar token antes de expirar
3. **Adicionar guard de rota** para proteger rotas no frontend
4. **Implementar tratamento de erro 401** globalmente

---

## 📚 Referências

- [JWT.io](https://jwt.io/) - Decodificar e entender tokens JWT
- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Angular: HTTP Interceptors](https://angular.io/guide/http-intercept-requests-and-responses)

