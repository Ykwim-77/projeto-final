import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

interface Produto {
  id: number;
  nome: string;
  sku: string;
  categoria: string;
  quantidade: number;
  preco: number;
  descricao?: string;
}

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.html',
  styleUrls: ['./produtos.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ProdutosComponent implements OnInit {
  // Controle de exibição
  showCardCadastro: boolean = false;
  produtoEditando: Produto | null = null;
  visualizacao: 'grade' | 'tabela' = 'grade';

  // Filtros
  filtros = {
    nome: '',
    sku: '', 
    categoria: '',
    precoMin: 0,
    precoMax: 10000,
    estoqueMin: 0
  };

  // Controle do dropdown de filtros
  filtroAberto: string | null = null;

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
  produtos: Produto[] = [
    { 
      id: 1, 
      nome: 'Mouse Gamer RGB', 
      sku: 'MG-001', 
      categoria: 'Periféricos', 
      quantidade: 15, 
      preco: 89.90,
      descricao: 'Mouse gamer com iluminação RGB'
    },
    { 
      id: 2, 
      nome: 'Teclado Mecânico', 
      sku: 'TK-002', 
      categoria: 'Periféricos', 
      quantidade: 8, 
      preco: 249.90,
      descricao: 'Teclado mecânico switches blue'
    },
    { 
      id: 3, 
      nome: 'Monitor 24" Full HD', 
      sku: 'MN-003', 
      categoria: 'Eletrônicos', 
      quantidade: 3, 
      preco: 899.90,
      descricao: 'Monitor LED 24 polegadas'
    },
    { 
      id: 4, 
      nome: 'Headphone Bluetooth', 
      sku: 'HP-004', 
      categoria: 'Acessórios', 
      quantidade: 12, 
      preco: 199.90,
      descricao: 'Fone de ouvido sem fio'
    },
    { 
      id: 5, 
      nome: 'Webcam 1080p', 
      sku: 'WC-005', 
      categoria: 'Periféricos', 
      quantidade: 2, 
      preco: 149.90,
      descricao: 'Webcam Full HD para streaming'
    },
    { 
      id: 6, 
      nome: 'SSD 512GB', 
      sku: 'SS-006', 
      categoria: 'Informática', 
      quantidade: 20, 
      preco: 299.90,
      descricao: 'SSD NVMe de alta velocidade'
    }
  ];

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
  usuarioNome: string = 'João Silva';
  usuarioEmail: string = 'joao.silva@empresa.com';
  usuarioIniciais: string = 'JS';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // Fechar dropdown quando clicar fora
  @HostListener('document:click', ['$event'])
  fecharDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.coluna-filtravel')) {
      this.filtroAberto = null;
    }
  }

  // Abrir/fechar dropdown de filtro
  toggleFiltro(tipo: string) {
    if (this.filtroAberto === tipo) {
      this.filtroAberto = null;
    } else {
      this.filtroAberto = tipo;
    }
  }

  // Limpar filtro de preço
  limparFiltroPreco() {
    this.filtros.precoMin = 0;
    this.filtros.precoMax = 10000;
  }

  // Limpar todos os filtros
  limparTodosFiltros() {
    this.filtros = {
      nome: '',
      sku: '', 
      categoria: '',
      precoMin: 0,
      precoMax: 10000,
      estoqueMin: 0
    };
    this.filtroAberto = null;
  }

  // Verificar se há algum filtro ativo
  get filtrosAtivos(): boolean {
    return !!(
      this.filtros.nome ||
      this.filtros.sku ||
      this.filtros.categoria ||
      this.filtros.precoMin > 0 ||
      this.filtros.precoMax < 10000 ||
      this.filtros.estoqueMin > 0
    );
  }

  // Método para filtrar produtos
  get produtosFiltrados(): Produto[] {
    return this.produtos.filter(produto => {
      // Filtro por nome
      if (this.filtros.nome && !produto.nome.toLowerCase().includes(this.filtros.nome.toLowerCase())) {
        return false;
      }
      
      // Filtro por SKU
      if (this.filtros.sku && !produto.sku.toLowerCase().includes(this.filtros.sku.toLowerCase())) {
        return false;
      }
      
      // Filtro por categoria
      if (this.filtros.categoria && produto.categoria !== this.filtros.categoria) {
        return false;
      }
      
      // Filtro por preço mínimo
      if (this.filtros.precoMin && produto.preco < this.filtros.precoMin) {
        return false;
      }
      
      // Filtro por preço máximo
      if (this.filtros.precoMax && produto.preco > this.filtros.precoMax) {
        return false;
      }
      
      // Filtro por estoque mínimo
      if (this.filtros.estoqueMin && produto.quantidade < this.filtros.estoqueMin) {
        return false;
      }
      
      return true;
    });
  }

  // Inicialização
  ngOnInit() {
    this.carregarDadosUsuario();
    this.initializeMenu();
    this.initializeAlerts();
    this.initializeMetrics();
    this.initializeCategories();
    this.initializeLowStockProducts();
    this.atualizarMetricas();
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
      nome: produto.nome,
      sku: produto.sku,
      categoria: produto.categoria,
      quantidade: produto.quantidade,
      preco: produto.preco,
      descricao: produto.descricao || ''
    };
    this.showCardCadastro = true;
  }

  // Salvar produto (criar ou atualizar)
  salvarProduto() {
    // Validações básicas
    if (!this.novoProduto.nome.trim()) {
      alert('O nome do produto é obrigatório!');
      return;
    }

    if (!this.novoProduto.sku.trim()) {
      alert('O SKU do produto é obrigatório!');
      return;
    }

    if (this.novoProduto.quantidade < 0) {
      alert('A quantidade não pode ser negativa!');
      return;
    }

    if (this.novoProduto.preco <= 0) {
      alert('O preço deve ser maior que zero!');
      return;
    }

    if (this.produtoEditando) {
      // Atualizar produto existente
      const index = this.produtos.findIndex(p => p.id === this.produtoEditando!.id);
      if (index !== -1) {
        this.produtos[index] = {
          ...this.produtoEditando,
          nome: this.novoProduto.nome,
          sku: this.novoProduto.sku,
          categoria: this.novoProduto.categoria,
          quantidade: Number(this.novoProduto.quantidade),
          preco: Number(this.novoProduto.preco),
          descricao: this.novoProduto.descricao
        };
      }
    } else {
      // Criar novo produto
      const novoId = this.produtos.length > 0 
        ? Math.max(...this.produtos.map(p => p.id)) + 1 
        : 1;
      
      const produto: Produto = {
        id: novoId,
        nome: this.novoProduto.nome,
        sku: this.novoProduto.sku,
        categoria: this.novoProduto.categoria,
        quantidade: Number(this.novoProduto.quantidade),
        preco: Number(this.novoProduto.preco),
        descricao: this.novoProduto.descricao
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
      total + (produto.preco * produto.quantidade), 0
    );
    
    this.stockValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valorTotal);

    this.lowStockCount = this.produtos.filter(p => p.quantidade < 5).length;

    // Atualizar metricCards
    this.metricCards = [
      {
        title: 'Total de Produtos',
        value: this.totalProducts,
        variation: '+12% este mês',
        trend: 'positive'
      },
      {
        title: 'Valor do Estoque',
        value: this.stockValue,
        variation: '+8.2%',
        trend: 'positive'
      },
      {
        title: 'Itens em Baixa',
        value: this.lowStockCount,
        variation: 'atenção',
        trend: this.lowStockCount > 0 ? 'negative' : 'neutral'
      },
      {
        title: 'Saídas do Mês',
        value: 20,
        variation: '+5%',
        trend: 'positive'
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
    this.lowStockCount = this.produtos.filter(p => p.quantidade < 5).length;
    this.lowStockAlert = `Atenção! Você tem ${this.lowStockCount} produto(s) com estoque baixo.`;
  }

  private initializeMetrics(): void {
    this.atualizarMetricas();
  }

  private initializeCategories(): void {
    // Obter categorias únicas dos produtos
    const categoriasUnicas = [...new Set(this.produtos.map(p => p.categoria))];
    
    this.categories = categoriasUnicas.map(categoria => ({
      name: categoria,
      percentage: Math.round((this.produtos.filter(p => p.categoria === categoria).length / this.produtos.length) * 100) + '%'
    }));
  }

  private initializeLowStockProducts(): void {
    this.lowStockProducts = this.produtos
      .filter(p => p.quantidade < 5)
      .map(p => ({
        name: p.nome,
        category: p.categoria
      }));
  }

  private carregarDadosUsuario(): void {
    const usuario = this.authService.getUsuarioLogado();
    
    if (usuario) {
      this.usuarioNome = usuario.nome || 'Usuário';
      this.usuarioEmail = usuario.email || '';
      this.usuarioIniciais = this.gerarIniciais(this.usuarioNome);
    } else {
      // this.router.navigate(['/login']);
    }
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

  // Método para obter categorias únicas (usado no dropdown de categoria)
  get categoriasUnicas(): string[] {
    return [...new Set(this.produtos.map(p => p.categoria))];
  }
}