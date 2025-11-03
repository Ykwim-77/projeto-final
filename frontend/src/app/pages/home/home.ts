import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ProdutoService, Produto } from '../../services/produto.service';
import { AuthService } from '../../services/auth.service';

// 1. Primeiro, vamos criar as INTERFACES para tipagem
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
  styleUrls: ['./home.scss'],
   imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class HomeComponent implements OnInit {
  
  // 2. Agora vamos declarar as PROPRIEDADES que usamos no HTML
  
  // Dados do Menu
  menuItems: MenuItem[] = [];
  
  // Alertas
  lowStockAlert: string = '';
  lowStockCount: number = 0;
  
  // Cards de Métricas
  metricCards: MetricCard[] = [];
  
  // Dados individuais (usados diretamente no HTML)
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

  // CONSTRUCTOR: Aqui injetamos os serviços que vamos usar
  constructor(
    private produtoService: ProdutoService,
    private authService: AuthService,
    private router: Router
  ) {}

  // 3. No ngOnInit vamos INICIALIZAR todos os dados
  ngOnInit() {
    this.carregarDadosUsuario(); // ⬅️ Carrega dados do usuário logado
    this.initializeMenu();
    this.carregarProdutos(); // ⬅️ Busca produtos da API quando o componente inicia
    this.initializeAlerts();
    this.initializeMetrics();
    this.initializeCategories();
    this.initializeLowStockProducts();
  }

  // 4. Vamos criar MÉTODOS para organizar a inicialização

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
    // Inicializa com valores padrão
    // Os valores reais serão calculados em atualizarProdutosEmBaixa()
    this.lowStockCount = 0;
    this.lowStockAlert = '';
  }

  /**
   * Calcula produtos em baixa baseado nos dados reais
   * Nota: Por enquanto, como não temos estoque da API, vamos considerar
   * produtos sem preço ou sem categoria como "em atenção"
   * Quando tiver API de estoque, ajustar esta lógica
   */
  private atualizarProdutosEmBaixa(): void {
    // Por enquanto, vamos considerar produtos sem preço ou quantidade zero
    // TODO: Quando tiver API de estoque, comparar quantidade_atual com quantidade_minima
    
    this.lowStockProducts = [];
    
    // Filtra produtos que podem estar em baixa
    // (exemplo: produtos sem preço, sem descrição, ou você pode adicionar outra lógica)
    const produtosEmAtencao = this.produtos.filter(produto => {
      // Lógica temporária: produtos sem preço podem estar em falta
      return !produto.preco_unitario || produto.preco_unitario === 0;
    });

    // Converte para o formato LowStockProduct
    this.lowStockProducts = produtosEmAtencao.map(produto => ({
      name: produto.nome,
      category: produto.categoria || 'Sem categoria'
    }));

    // Atualiza contagem
    this.lowStockCount = this.lowStockProducts.length;
    
    // Atualiza mensagem de alerta
    if (this.lowStockCount > 0) {
      this.lowStockAlert = `Atenção! Você tem ${this.lowStockCount} produto(s) com estoque baixo.`;
    } else {
      this.lowStockAlert = 'Estoque em dia! Todos os produtos estão com quantidade adequada.';
    }
  }

  private initializeMetrics(): void {
    // Este método agora só será usado para inicializar valores padrão
    // Os valores reais serão calculados em atualizarMetricas()
    this.totalProducts = 0;
    this.stockValue = 'R$ 0,00';
    
    // Array de cards com valores iniciais
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

  /**
   * Calcula as métricas com base nos produtos reais da API
   * Este método é chamado depois que os produtos são carregados
   */
  private atualizarMetricas(): void {
    // 1. Total de produtos = quantidade de itens no array
    this.totalProducts = this.produtos.length;
    
    // 2. Calcular valor total do estoque
    // Percorre todos os produtos e soma os preços
    let valorTotal = 0;
    this.produtos.forEach(produto => {
      // Se o produto tem preço, adiciona ao total
      if (produto.preco_unitario) {
        valorTotal += produto.preco_unitario;
      }
    });
    
    // Formata como moeda brasileira (R$ 1.234,56)
    this.stockValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valorTotal);
    
    // 3. Atualiza os cards de métricas com os valores calculados
    this.metricCards = [
      {
        title: 'Total de Produtos',
        value: this.totalProducts,
        variation: '+12% este mês', // Por enquanto fixo, depois calculamos
        trend: this.totalProducts > 0 ? 'positive' : 'neutral'
      },
      {
        title: 'Valor do Estoque',
        value: this.stockValue,
        variation: '+8.2%', // Por enquanto fixo
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
        value: 20, // Por enquanto fixo
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
    // Inicializa vazio - será preenchido em atualizarProdutosEmBaixa()
    this.lowStockProducts = [];
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MÉTODOS PARA GERENCIAR USUÁRIO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Carrega os dados do usuário logado
   */
  private carregarDadosUsuario(): void {
    const usuario = this.authService.getUsuarioLogado();
    
    if (usuario) {
      this.usuarioNome = usuario.nome || 'Usuário';
      this.usuarioEmail = usuario.email || '';
      
      // Gera iniciais do nome (ex: "Rafael Luiz" → "RL")
      this.usuarioIniciais = this.gerarIniciais(this.usuarioNome);
    } else {
      // Se não tem usuário logado, volta para login
      // this.router.navigate(['/login']);
    }
  }

  /**
   * Gera as iniciais do nome para o avatar
   */
  private gerarIniciais(nome: string): string {
    const palavras = nome.trim().split(' ');
    if (palavras.length >= 2) {
      return (palavras[0][0] + palavras[palavras.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  }

  /**
   * Realiza logout do usuário
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MÉTODO PARA BUSCAR PRODUTOS DA API
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Este método busca os produtos do backend e salva na propriedade 'produtos'
   */
  private carregarProdutos(): void {
    // Chama o serviço para buscar produtos da API
    this.produtoService.listarProdutos().subscribe({
      // Quando a requisição for bem-sucedida (sucesso)
      next: (produtos) => {
        // Salva os produtos na propriedade da classe
        this.produtos = produtos;
        
        // Log no console para você ver se funcionou
        console.log('✅ Produtos carregados:', produtos);
        console.log('📊 Total de produtos:', produtos.length);
        
        // Depois de carregar os produtos, vamos atualizar as métricas
        this.atualizarMetricas();
        // E também atualizar os produtos em baixa
        this.atualizarProdutosEmBaixa();
      },
      // Quando a requisição der erro
      error: (error) => {
        console.error('❌ Erro ao carregar produtos:', error);
        // Aqui você pode mostrar uma mensagem de erro para o usuário
      }
    });
  }
}
