# 📱 ProGest - Frontend

> Frontend da aplicação ProGest - Sistema de Gestão Inteligente de Estoque para micro e pequenas empresas.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Arquitetura](#arquitetura)
- [Serviços](#serviços)
- [Componentes](#componentes)
- [Rotas](#rotas)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Guia de Desenvolvimento](#guia-de-desenvolvimento)
- [Próximos Passos](#próximos-passos)

---

## 🎯 Sobre o Projeto

O **ProGest** é um sistema de gestão de estoque desenvolvido para micro e pequenas empresas, oferecendo uma solução simples, intuitiva e moderna para controle de inventário.

### Principais Características

- ✅ **Interface Moderna e Responsiva**: Design limpo e intuitivo
- ✅ **Autenticação de Usuários**: Sistema de login e cadastro
- ✅ **Dashboard Interativo**: Visualização de métricas e indicadores
- ✅ **Gestão de Produtos**: Cadastro, edição e visualização de produtos
- ✅ **API REST Integrada**: Comunicação com backend Node.js
- ✅ **Componentes Standalone**: Arquitetura moderna do Angular

---

## 🛠️ Tecnologias Utilizadas

- **Angular 20.3.0** - Framework principal
- **TypeScript 5.9.2** - Linguagem de programação
- **RxJS 7.8.0** - Programação reativa
- **Angular Router** - Navegação entre páginas
- **Angular Forms** - Formulários reativos
- **SCSS** - Pré-processador CSS

---

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizáveis (futuro)
│   │   ├── environments/        # Configurações de ambiente
│   │   │   ├── environment.ts          # Desenvolvimento
│   │   │   └── environment.prod.ts     # Produção
│   │   ├── guards/              # Guards de rota (futuro)
│   │   ├── models/              # Interfaces e modelos (futuro)
│   │   ├── pages/               # Páginas da aplicação
│   │   │   ├── cadastro/
│   │   │   ├── home/
│   │   │   ├── login/
│   │   │   └── produtos/
│   │   ├── services/            # Serviços HTTP
│   │   │   ├── auth.service.ts
│   │   │   ├── produto.service.ts
│   │   │   └── usuario.service.ts
│   │   ├── app.component.ts     # Componente raiz
│   │   ├── app.config.ts        # Configuração da aplicação
│   │   └── app.routes.ts        # Definição de rotas
│   ├── assets/                  # Arquivos estáticos (imagens, etc.)
│   ├── index.html
│   ├── main.ts                  # Ponto de entrada
│   └── styles.scss              # Estilos globais
├── angular.json
├── package.json
└── README.md
```

---

## ⚙️ Instalação e Configuração

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** (vem com Node.js)

### Passo a Passo

1. **Navegue até a pasta do frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o ambiente:**
   
   Edite o arquivo `src/app/environments/environment.ts` e verifique se a URL da API está correta:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000'  // URL do backend
   };
   ```

---

## 🚀 Executando o Projeto

### Modo Desenvolvimento

```bash
ng serve
# ou
npm start
```

O servidor de desenvolvimento será iniciado em `http://localhost:4200`.

### Build para Produção

```bash
ng build
# ou
npm run build
```

Os arquivos compilados estarão em `dist/frontend/`.

### Executar Testes

```bash
ng test
# ou
npm test
```

---

## 🏗️ Arquitetura

### Padrão de Arquitetura

O projeto segue o padrão **Component-Based Architecture** do Angular, utilizando:

- **Standalone Components**: Componentes independentes sem módulos
- **Service Pattern**: Lógica de negócio e comunicação HTTP em serviços
- **Dependency Injection**: Injeção de dependências via construtor

### Fluxo de Dados

```
Component → Service → HTTP Client → Backend API
     ↑                                      ↓
     └────────── Response ←─────────────────┘
```

---

## 🔧 Serviços

### AuthService (`auth.service.ts`)

Gerencia autenticação e sessão do usuário.

**Métodos principais:**
- `login(email, senha)`: Realiza login do usuário
- `logout()`: Encerra sessão
- `isAuthenticated()`: Verifica se usuário está autenticado
- `getUsuarioLogado()`: Retorna dados do usuário logado
- `criarUsuario(dados)`: Cria novo usuário (cadastro)

**Exemplo de uso:**
```typescript
constructor(private authService: AuthService) {}

login() {
  this.authService.login(this.email, this.password).subscribe({
    next: (response) => {
      // Login bem-sucedido
      this.router.navigate(['/home']);
    },
    error: (error) => {
      // Tratar erro
    }
  });
}
```

### ProdutoService (`produto.service.ts`)

Gerencia operações relacionadas a produtos.

**Métodos principais:**
- `listarProdutos()`: Busca todos os produtos
- `buscarProdutoPorId(id)`: Busca produto específico
- `criarProduto(produto)`: Cria novo produto
- `atualizarProduto(id, produto)`: Atualiza produto
- `deletarProduto(id)`: Remove produto
- `reservarProduto(id)`: Reserva produto
- `entregarProduto(id)`: Libera produto reservado

**Exemplo de uso:**
```typescript
constructor(private produtoService: ProdutoService) {}

carregarProdutos() {
  this.produtoService.listarProdutos().subscribe({
    next: (produtos) => {
      this.produtos = produtos;
    },
    error: (error) => {
      console.error('Erro:', error);
    }
  });
}
```

### UsuarioService (`usuario.service.ts`)

Gerencia operações relacionadas a usuários.

**Métodos principais:**
- `listarUsuarios()`: Lista todos os usuários
- `buscarUsuarioPorId(id)`: Busca usuário específico
- `atualizarUsuario(id, dados)`: Atualiza dados do usuário
- `desativarUsuario(id)`: Desativa usuário

---

## 📄 Componentes

### LoginComponent (`pages/login/login`)

Página de autenticação do sistema.

**Funcionalidades:**
- Formulário de login com validação
- Integração com AuthService
- Tratamento de erros
- Loading state durante requisição
- Navegação para cadastro

**Arquivos:**
- `login.ts` - Lógica do componente
- `login.html` - Template HTML
- `login.scss` - Estilos

### CadastroComponent (`pages/cadastro/cadastro`)

Página de cadastro de novos usuários.

**Funcionalidades:**
- Formulário de cadastro completo
- Validação de senhas
- Integração com AuthService
- Feedback visual de sucesso/erro

### HomeComponent (`pages/home/home`)

Dashboard principal do sistema.

**Funcionalidades:**
- Cards de métricas (Total de Produtos, Valor do Estoque, etc.)
- Integração com ProdutoService
- Cálculo dinâmico de métricas
- Gráficos (preparado para implementação)
- Menu lateral de navegação

**Métricas exibidas:**
- Total de Produtos
- Valor do Estoque (calculado)
- Itens em Baixa
- Saídas do Mês

### ProdutosComponent (`pages/produtos/produtos`)

Página de gestão de produtos.

**Funcionalidades:**
- Visualização de produtos
- Dashboard de produtos
- Integração com ProdutoService

---

## 🗺️ Rotas

As rotas estão definidas em `app.routes.ts`:

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | - | Redireciona para `/login` |
| `/login` | LoginComponent | Página de login |
| `/cadastro` | CadastroComponent | Página de cadastro |
| `/home` | HomeComponent | Dashboard principal |
| `/produtos` | ProdutosComponent | Página de produtos |
| `**` | - | Redireciona para `/login` (rota não encontrada) |

---

## 🌍 Configuração de Ambiente

### environment.ts (Desenvolvimento)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

### environment.prod.ts (Produção)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.progest.com.br'
};
```

**Importante:** Atualize a URL da API de produção antes do deploy.

---

## 📚 Guia de Desenvolvimento

### Criar um Novo Componente

```bash
ng generate component pages/nome-do-componente
```

### Criar um Novo Serviço

```bash
ng generate service services/nome-do-servico
```

### Adicionar uma Nova Rota

Edite `app.routes.ts`:

```typescript
export const routes: Routes = [
  // ... rotas existentes
  { path: 'nova-rota', component: NovoComponent }
];
```

### Como Usar um Serviço

1. **Importe o serviço:**
   ```typescript
   import { ProdutoService } from '../../services/produto.service';
   ```

2. **Injete no construtor:**
   ```typescript
   constructor(private produtoService: ProdutoService) {}
   ```

3. **Use nos métodos:**
   ```typescript
   ngOnInit() {
     this.produtoService.listarProdutos().subscribe(...);
   }
   ```

### Tratamento de Erros

Sempre trate erros nas requisições HTTP:

```typescript
this.service.metodo().subscribe({
  next: (response) => {
    // Sucesso
  },
  error: (error) => {
    console.error('Erro:', error);
    // Tratar erro (mostrar mensagem, etc.)
  }
});
```

---

## 🔐 Autenticação

### Fluxo de Autenticação

1. Usuário preenche email e senha no LoginComponent
2. AuthService envia credenciais para `/usuario/login`
3. Backend valida e retorna token/usuário
4. Token e dados do usuário são salvos no `localStorage`
5. Usuário é redirecionado para `/home`

### Armazenamento Local

O sistema utiliza `localStorage` para:
- **Token de autenticação**: `progest_token`
- **Dados do usuário**: `progest_user`

### Verificar Autenticação

```typescript
if (this.authService.isAuthenticated()) {
  // Usuário está logado
}
```

---

## 📊 Integração com Backend

### Configuração da URL da API

Edite `src/app/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'  // URL do seu backend
};
```

### Endpoints Utilizados

| Método | Endpoint | Serviço | Descrição |
|--------|----------|---------|-----------|
| POST | `/usuario/login` | AuthService | Login |
| POST | `/usuario` | AuthService | Cadastro |
| GET | `/produto` | ProdutoService | Listar produtos |
| GET | `/produto/:id` | ProdutoService | Buscar produto |
| POST | `/produto` | ProdutoService | Criar produto |
| PUT | `/produto/:id` | ProdutoService | Atualizar produto |
| DELETE | `/produto/:id` | ProdutoService | Deletar produto |

---

## 🎨 Estilos

### Paleta de Cores

- **Azul Primário**: `#002793` / `#0B1D5A`
- **Azul Claro**: `#3498db`
- **Cinza Claro**: `#d0ddff` (background)
- **Branco**: `#FFFFFF`
- **Verde**: Para indicadores positivos
- **Vermelho**: Para alertas/erros

### Fontes

- **Principal**: Oswald (sans-serif)
- **Ícones**: Font Awesome 6.0

---

## 🚧 Próximos Passos

### Funcionalidades Planejadas

- [ ] **Página de Movimentações**: Controle de entradas e saídas
- [ ] **Gráficos no Dashboard**: Implementação com Chart.js
- [ ] **Tela de Planos**: Modelo freemium
- [ ] **Tela de Relatórios**: Exportação de dados
- [ ] **Tela de Configurações**: Configurações de conta
- [ ] **Guards de Rota**: Proteção de rotas autenticadas
- [ ] **Upload de Imagens**: Upload de imagens de produtos
- [ ] **Validação Avançada**: Formulários com validações customizadas
- [ ] **Loading States**: Indicadores de carregamento globais
- [ ] **Tratamento de Erros**: Mensagens de erro amigáveis

---

## 📝 Notas de Desenvolvimento

### Estrutura de Pastas

Cada componente/página segue o padrão:
```
componente/
├── componente.ts      # Lógica
├── componente.html    # Template
├── componente.scss    # Estilos
└── componente.spec.ts # Testes (futuro)
```

### Convenções de Código

- **Nomes de componentes**: PascalCase (ex: `HomeComponent`)
- **Nomes de serviços**: PascalCase com sufixo Service (ex: `ProdutoService`)
- **Nomes de variáveis**: camelCase (ex: `totalProducts`)
- **Arquivos**: kebab-case (ex: `home.component.ts`)

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

```bash
cd ..
npm install
```

### Erro de CORS ao fazer requisições

Verifique se o backend está configurado para aceitar requisições do frontend. O backend deve ter CORS habilitado.

### Erro: "ng: command not found"

```bash
npm install -g @angular/cli
```

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do Angular: https://angular.dev
2. Consulte a documentação do projeto
3. Entre em contato com a equipe de desenvolvimento

---

## 📄 Licença

Este projeto faz parte do ProGest - Sistema de Gestão de Estoque.

---

**Última atualização**: 2025-01-XX
**Versão**: 1.0.0
