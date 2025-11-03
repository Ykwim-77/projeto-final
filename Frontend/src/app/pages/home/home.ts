import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoService, Produto } from '../../services/produto.service';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
  // REMOVIDO: imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class HomeComponent implements OnInit {
logout() {
throw new Error('Method not implemented.');
}
  
  // Dados do Menu
  menuItems: MenuItem[] = [];
  
  // Alertas
  lowStockAlert: string = '';
  lowStockCount: number = 0;
  
  // Cards de Métricas
  metricCards: MetricCard[] = [];
  
  // Dados individuais
  totalProducts: number = 0;
  stockValue: string = '';
  
  // Listas
  categories: Category[] = [];
  lowStockProducts: LowStockProduct[] = [];
  
  // Propriedade para armazenar produtos da API
  produtos: Produto[] = [];

  // Dados do usuário logado
  usuarioNome: string = '';
  usuarioEmail: string = '';
  usuarioIniciais: string = '';

  constructor(
    private produtoService: ProdutoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarDadosUsuario();
    this.initializeMenu();
    this.carregarProdutos();
    this.initializeAlerts();
    this.initializeMetrics();
    this.initializeCategories();
    this.initializeLowStockProducts();
  }

  private initializeMenu(): void {
    this.menuItems = [
      { name: 'Dashboard', active: true },
      { name: 'Produtos' },
      { name: 'Movimentações' },
      { name: 'Relatórios' },
      { name: 'Previsão IA' },
      { name: 'Planos' },
      { name: 'Configurações' }
    ];
  }

  private initializeAlerts(): void {
    this.lowStockCount = 0;
    this.lowStockAlert = '';
  }

  private atualizarProdutosEmBaixa(): void {
    this.lowStockProducts = [];
    
    const produtosEmAtencao = this.produtos.filter(produto => {
      return !produto.preco_unitario || produto.preco_unitario === 0;
    });

    this.lowStockProducts = produtosEmAtencao.map(produto => ({
      name: produto.nome,
      category: produto.categoria || 'Sem categoria'
    }));

    this.lowStockCount = this.lowStockProducts.length;
    
    if (this.lowStockCount > 0) {
      this.lowStockAlert = `Atenção! Você tem ${this.lowStockCount} produto(s) com estoque baixo.`;
    } else {
      this.lowStockAlert = 'Estoque em dia! Todos os produtos estão com quantidade adequada.';
    }
  }

  private initializeMetrics(): void {
    this.totalProducts = 0;
    this.stockValue = 'R$ 0,00';
    
    this.metricCards = [
      {
        title: 'Total de Produtos',
        value: this.totalProducts,
        variation: '-',
        trend: 'neutral'
      },
      {
        title: 'Valor do Estoque',
        value: this.stockValue,
        variation: '-',
        trend: 'neutral'
      },
      {
        title: 'Itens em Baixa',
        value: this.lowStockCount,
        variation: '-',
        trend: 'neutral'
      },
      {
        title: 'Saídas do Mês',
        value: 0,
        variation: '-',
        trend: 'neutral'
      }
    ];
  }

  private atualizarMetricas(): void {
    this.totalProducts = this.produtos.length;
    
    let valorTotal = 0;
    this.produtos.forEach(produto => {
      if (produto.preco_unitario) {
        valorTotal += produto.preco_unitario;
      }
    });
    
    this.stockValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valorTotal);
    
    this.metricCards = [
      {
        title: 'Total de Produtos',
        value: this.totalProducts,
        variation: '+12% este mês',
        trend: this.totalProducts > 0 ? 'positive' : 'neutral'
      },
      {
        title: 'Valor do Estoque',
        value: this.stockValue,
        variation: '+8.2%',
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
        value: 20,
        variation: '+5%',
        trend: 'positive'
      }
    ];
  }

  private initializeCategories(): void {
    this.categories = [
      { name: 'Alimentos', percentage: '45%' },
      { name: 'Eletrônicos', percentage: '20%' },
      { name: 'Cosméticos', percentage: '2%' },
      { name: 'Papelaria', percentage: '32%' }
    ];
  }

  private initializeLowStockProducts(): void {
    this.lowStockProducts = [];
  }

  private carregarDadosUsuario(): void {
    const usuario = this.authService.getUsuarioLogado();
    
    if (usuario) {
      this.usuarioNome = usuario.nome || 'Usuário';
      this.usuarioEmail = usuario.email || '';
      this.usuarioIniciais = this.gerarIniciais(this.usuarioNome);
    } else {
      this.router.navigate(['/login']);
    }
  }

  private gerarIniciais(nome: string): string {
    const palavras = nome.trim().split(' ');
    if (palavras.length >= 2) {
      return (palavras[0][0] + palavras[palavras.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  }

  fazerLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private carregarProdutos(): void {
    this.produtoService.listarProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        console.log('✅ Produtos carregados:', produtos);
        this.atualizarMetricas();
        this.atualizarProdutosEmBaixa();
      },
      error: (error) => {
        console.error('❌ Erro ao carregar produtos:', error);
      }
    });
  }
}