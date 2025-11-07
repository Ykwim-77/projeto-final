
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DecimalPipe } from '@angular/common';
import { ProdutoService, Produto } from '../../services/produto.service';

interface MenuItem {
  name: string;
  active?: boolean;
}

interface MetricCard {
  title: string;
  value: string | number;
  variation: string;
  trend: 'positive' | 'negative' | 'neutral';
}

interface Category {
  name: string;
  percentage: string;
}

interface LowStockProduct {
  name: string;
  category: string;
}

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.html',
  styleUrls: ['./produtos.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalPipe]
})
export class ProdutosComponent implements OnInit {
categoriasUnicas: any;
limparFiltroPreco() {
throw new Error('Method not implemented.');
}
toggleFiltro(arg0: string) {
throw new Error('Method not implemented.');
}
  // Controle de exibição
  showCardCadastro: boolean = false;
  produtoEditando: Produto | null = null;
  visualizacao: 'grade' | 'tabela' = 'grade';

  // Produto em cadastro/edição
  novoProduto = {
    nome: '',
    sku: '',
    categoria: '',
    quantidade: 0,
    preco: 0,
    descricao: ''
  };

  // Lista de produtos
  produtos: Produto[] = [];

  // Dados de interface
  menuItems: MenuItem[] = [];
  lowStockCount: number = 0;
  lowStockAlert: string = '';

  // Cards de Métricas
  metricCards: MetricCard[] = [];
  // Dados individuais
  totalProducts: number = 0;
  stockValue: string = '';

  // Listas
  categories: Category[] = [];
  lowStockProducts: LowStockProduct[] = [];

  // Usuário
  usuarioNome: string = '';
  usuarioEmail: string = '';
  usuarioIniciais: string = '';
produtosFiltrados: any;
filtros: any;
filtroAberto: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private produtoService: ProdutoService
  ) {}

  // Inicialização
  ngOnInit() {
    this.carregarDadosUsuario();
    this.initializeMenu();
    this.carregarProdutos();
    this.initializeAlerts();
    this.initializeMetrics();
    this.initializeCategories();
    this.initializeLowStockProducts();
  }

  // 🔧 MÉTODOS DO CRUD

  // Abrir card de cadastro
  abrirCardCadastro() {
    this.produtoEditando = null;
    this.novoProduto = {
      nome: '',
      sku: '',
      categoria: '',
      quantidade: 0,
      preco: 0,
      descricao: ''
    };
    this.showCardCadastro = true;
  }

  // Editar produto
  editarProduto(produto: Produto) {
    this.produtoEditando = produto;
    this.novoProduto = {
      nome: produto.name || '',
      sku: produto.sku,
      categoria: produto.categoria || '',
      quantidade: produto.estoque || 0,
      preco: produto.preco || 0,
      descricao: produto.descricao || ''
    };
    this.showCardCadastro = true;
  }

  // Salvar produto (criar ou atualizar)
  salvarProduto() {
    if (this.produtoEditando) {
      // Atualizar produto existente
      const index = this.produtos.findIndex(p => p.id === this.produtoEditando!.id);
      if (index !== -1) {
        this.produtos[index] = {
          ...this.produtoEditando,
          name: this.novoProduto.nome,
          sku: this.novoProduto.sku,
          categoria: this.novoProduto.categoria,
          minStock: this.produtoEditando.minStock || 0,
          estoque: Number(this.novoProduto.quantidade),
          estoque_maximo: this.produtoEditando.estoque_maximo || 0,
          preco: Number(this.novoProduto.preco),
          descricao: this.novoProduto.descricao,
          id_produto: this.produtoEditando.id_produto || 0,
          id_fornecedor: this.produtoEditando.id_fornecedor || 0
        };
      }
    } else {
      // Criar novo produto
      const novoId = this.produtos.length > 0 
        ? Math.max(...this.produtos.map(p => p.id || 0)) + 1 
        : 1;
      
      // Criar objeto com TODAS as propriedades da interface Produto
      const produto: Produto = {
        id: novoId,
        name: this.novoProduto.nome.trim(),
        sku: this.novoProduto.sku.trim(),
        categoria: this.novoProduto.categoria,
        minStock: 0,
        estoque: Number(this.novoProduto.quantidade),
        estoque_maximo: 0,
        preco: Number(this.novoProduto.preco),
        descricao: this.novoProduto.descricao?.trim(),
        id_produto: 0,
        id_fornecedor: 0,
        quantidade: 0,
        nome: ''
      };
      
      this.produtos.push(produto);
    }

    this.fecharCardCadastro();
    this.atualizarMetricas();
  }

  // Excluir produto
  excluirProduto(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.produtos = this.produtos.filter(produto => produto.id !== id);
      this.atualizarMetricas();
    }
  }

  // Fechar card de cadastro
  fecharCardCadastro() {
    this.showCardCadastro = false;
    this.produtoEditando = null;
    this.novoProduto = {
      nome: '',
      sku: '',
      categoria: '',
      quantidade: 0,
      preco: 0,
      descricao: ''
    };
  }

  // Mudar entre visualização grade/tabela
  mudarVisualizacao(tipo: 'grade' | 'tabela') {
    this.visualizacao = tipo;
  }

  // Atualizar métricas
  atualizarMetricas() {
    this.totalProducts = this.produtos.length;
    
    const valorTotal = this.produtos.reduce((total, produto) => 
      total + ((produto.preco || 0) * (produto.estoque || 0)), 0
    );
    
    this.stockValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valorTotal);

    this.lowStockCount = this.produtos.filter(p => (p.estoque || 0) < 5).length;

    // Atualizar metricCards
    this.metricCards = [
      {
        title: 'Total de Produtos',
        value: this.totalProducts,
        variation: this.totalProducts > 0 ? '+12% este mês' : '-',
        trend: this.totalProducts > 0 ? 'positive' : 'neutral'
      },
      {
        title: 'Valor do Estoque',
        value: this.stockValue,
        variation: valorTotal > 0 ? '+8.2%' : '-',
        trend: valorTotal > 0 ? 'positive' : 'neutral'
      },
      {
        title: 'Itens em Baixa',
        value: this.lowStockCount,
        variation: this.lowStockCount > 0 ? 'atenção' : 'tudo ok',
        trend: this.lowStockCount > 0 ? 'negative' : 'positive'
      },
      {
        title: 'Saídas do Mês',
        value: 0,
        variation: '-',
        trend: 'neutral'
      }
    ];
  }

  // 🔧 MÉTODOS AUXILIARES

  private initializeMenu(): void {
    this.menuItems = [
      { name: 'Dashboard' },
      { name: 'Produtos', active: true },
      { name: 'Movimentações' },
      { name: 'Relatórios' },
      { name: 'Previsão IA' },
      { name: 'Planos' },
      { name: 'Configurações' },
      { name: 'Usuários' }
    ];
  }

  private initializeAlerts(): void {
    this.lowStockCount = this.produtos.filter(p => (p.estoque || 0) < 5).length;
    if (this.lowStockCount > 0) {
      this.lowStockAlert = `Atenção! Você tem ${this.lowStockCount} produto(s) com estoque baixo.`;
    } else if (this.produtos.length === 0) {
      this.lowStockAlert = 'Nenhum produto cadastrado.';
    } else {
      this.lowStockAlert = 'Estoque em dia! Todos os produtos estão com quantidade adequada.';
    }
  }

  private initializeMetrics(): void {
    this.atualizarMetricas();
  }

  private initializeCategories(): void {
    this.categories = [
      { name: 'Periféricos', percentage: '45%' },
      { name: 'Eletrônicos', percentage: '20%' },
      { name: 'Informática', percentage: '15%' },
      { name: 'Acessórios', percentage: '20%' }
    ];
  }

  private initializeLowStockProducts(): void {
    this.lowStockProducts = this.produtos
      .filter(p => (p.estoque || 0) < 5)
      .map(p => ({
        name: p.name || '',
        category: p.categoria
      }));
  }

  private carregarDadosUsuario(): void {
    const usuario = this.authService.getUsuarioLogado();
    
    if (usuario) {
      this.usuarioNome = usuario.nome || 'Usuário';
      this.usuarioEmail = usuario.email || '';
      this.usuarioIniciais = this.gerarIniciais(this.usuarioNome);
    }
  }

  private carregarProdutos(): void {
    console.log('🔄 Iniciando carregamento de produtos da API...');
    
    this.produtoService.listarProdutos().subscribe({
      next: (produtos) => {
        console.log('✅ Produtos carregados da API:', produtos);
        this.produtos = produtos;
        this.atualizarMetricas();
        this.initializeAlerts();
        this.initializeCategories();
        this.initializeLowStockProducts();
      },
      error: (error) => {
        console.error('❌ Erro ao carregar produtos da API:', error);
        this.produtos = [];
        this.atualizarMetricas();
        this.initializeAlerts();
        this.initializeCategories();
        this.initializeLowStockProducts();
      }
    });
  }

  private gerarIniciais(nome: string): string {
    const palavras = nome.trim().split(' ');
    if (palavras.length >= 2) {
      return (palavras[0][0] + palavras[palavras.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}