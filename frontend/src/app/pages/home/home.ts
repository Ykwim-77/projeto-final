import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Produto } from '../../services/produto.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environments/environment';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Interface extendida para incluir o ID
interface ProdutoComId extends Produto {
  id: number;
}

interface ChartSlice {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, DecimalPipe, CurrencyPipe]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChart') pieChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart') barChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart') lineChart!: ElementRef<HTMLCanvasElement>;

  // Dados do Menu
  menuItems: any[] = [];
  
  // Alertas
  lowStockAlert: string = '';
  lowStockCount: number = 0;
  
  // Cards de Métricas
  metricCards: any[] = [];
  
  // Dados individuais
  totalProducts: number = 0;
  stockValue: string = '';
  
  // Listas
  categories: any[] = [];
  lowStockProducts: any[] = [];
  topProducts: any[] = [];
  movimentacoes: any[] = [];
  
  // Propriedade para armazenar produtos da API - usando a interface com ID
  produtos: ProdutoComId[] = [];

  // Dados do usuário logado
  usuarioNome: string = '';
  usuarioEmail: string = '';
  usuarioIniciais: string = '';

  // Dados do gráfico de pizza - AGORA DINÂMICOS
  chartData = {
    pie: [] as ChartSlice[]
  };

  // Paleta de cores para as categorias
  private colorPalette = [
    '#1E2A4F', '#2C3E6F', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899',
    '#6366F1', '#14B8A6', '#F43F5E', '#8B5CF6', '#06B6D4'
  ];

  // Variáveis para controle do tooltip
  private hoveredSlice: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('🚀 HomeComponent ngOnInit iniciado');
    this.carregarDadosUsuario();
    this.initializeMenu();
    this.initializeAlerts();
    this.initializeMetrics();
    this.initializeCategories();
    this.initializeLowStockProducts();
    // Carregar produtos por último para garantir que tudo está inicializado
    this.carregarProdutos();
  }

  ngAfterViewInit(): void {
    // Aguardar um pouco mais para garantir que os dados foram carregados
    setTimeout(() => {
      this.drawPieChart();
      this.drawBarChart();
      this.drawLineChart();
      this.setupEventListeners();
    }, 500);
  }

  // NOVO MÉTODO: Atualizar dados do gráfico baseado nos produtos
  private atualizarDadosGrafico(): void {
    console.log('🔄 Atualizando dados do gráfico...', {
      produtosLength: this.produtos?.length || 0
    });
    
    if (!this.produtos || this.produtos.length === 0) {
      this.chartData.pie = [
        { label: 'Sem produtos', value: 1, color: '#CCCCCC' }
      ];
      console.log('⚠️ Sem produtos, usando dados padrão');
      return;
    }

    // Agrupar produtos por categoria
    const categoriasMap = new Map<string, number>();
    
    this.produtos.forEach(produto => {
      const categoria = produto.categoria || 'Sem Categoria';
      const quantidade = this.obterQuantidadeProduto(produto);
      
      if (categoriasMap.has(categoria)) {
        categoriasMap.set(categoria, categoriasMap.get(categoria)! + quantidade);
      } else {
        categoriasMap.set(categoria, quantidade);
      }
    });

    // Converter para array e ordenar por quantidade (decrescente)
    const categoriasArray = Array.from(categoriasMap.entries())
      .map(([label, value], index) => ({
        label,
        value,
        color: this.colorPalette[index % this.colorPalette.length]
      }))
      .sort((a, b) => b.value - a.value);

    this.chartData.pie = categoriasArray;
    
    console.log('✅ Dados do gráfico atualizados:', {
      categorias: categoriasArray.length,
      dados: categoriasArray
    });
  }

  // Gráfico de Pizza com Tooltip
  drawPieChart(): void {
    if (!this.pieChart?.nativeElement) {
      console.warn('⚠️ pieChart não está disponível ainda');
      return;
    }
    
    const canvas = this.pieChart.nativeElement;
    const ctx = canvas.getContext('2d')!;
    
    if (!ctx) {
      console.error('❌ Não foi possível obter contexto do canvas');
      return;
    }
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const total = this.chartData.pie.reduce((sum, item) => sum + item.value, 0);
    
    console.log('🎨 Desenhando gráfico de pizza:', {
      total,
      items: this.chartData.pie.length,
      dados: this.chartData.pie
    });
    
    // Se não há dados válidos, mostrar mensagem
    if (total === 0 || this.chartData.pie.length === 0) {
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Sem dados para exibir', canvas.width / 2, canvas.height / 2);
      return;
    }
    
    let currentAngle = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Desenhar as fatias
    this.chartData.pie.forEach((item, index) => {
      const sliceAngle = (2 * Math.PI * item.value) / total;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      
      // Se é a fatia hovered, destacar
      if (this.hoveredSlice && this.hoveredSlice.label === item.label) {
        ctx.fillStyle = this.lightenColor(item.color, 20);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
      } else {
        ctx.fillStyle = item.color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
      }
      
      ctx.fill();
      ctx.stroke();
      
      currentAngle += sliceAngle;
    });

    // Desenhar tooltip se hoveredSlice existir
    if (this.hoveredSlice) {
      this.drawTooltip(ctx, this.hoveredSlice);
    }
  }

  // Configurar event listeners para interação
  setupEventListeners(): void {
    if (!this.pieChart?.nativeElement) return;
    
    const canvas = this.pieChart.nativeElement;

    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;
      
      const newHoveredSlice = this.getHoveredSlice(mouseX, mouseY, centerX, centerY, radius);
      
      canvas.style.cursor = newHoveredSlice ? 'pointer' : 'default';
      
      if (this.hoveredSlice?.label !== newHoveredSlice?.label) {
        this.hoveredSlice = newHoveredSlice;
        this.drawPieChart();
      }
    });

    canvas.addEventListener('mouseleave', () => {
      this.hoveredSlice = null;
      this.drawPieChart();
    });

    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;
      
      const clickedSlice = this.getHoveredSlice(mouseX, mouseY, centerX, centerY, radius);
      if (clickedSlice) {
        console.log(`Clicou em: ${clickedSlice.label} - ${clickedSlice.percentage}%`);
      }
    });
  }

  // Método para verificar qual fatia está sob o mouse
  getHoveredSlice(mouseX: number, mouseY: number, centerX: number, centerY: number, radius: number): any {
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > radius) return null;
    
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += 2 * Math.PI;
    
    const total = this.chartData.pie.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    for (const item of this.chartData.pie) {
      const sliceAngle = (2 * Math.PI * item.value) / total;
      const percentage = ((item.value / total) * 100).toFixed(1);
      
      if (angle >= currentAngle && angle <= currentAngle + sliceAngle) {
        return {
          ...item,
          percentage: percentage,
          startAngle: currentAngle,
          endAngle: currentAngle + sliceAngle
        };
      }
      currentAngle += sliceAngle;
    }
    
    return null;
  }

  // Método para desenhar o tooltip
  drawTooltip(ctx: CanvasRenderingContext2D, slice: any): void {
    const tooltipWidth = 200;
    const tooltipHeight = 70;
    const padding = 10;
    
    const tooltipX = 10;
    const tooltipY = 10;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    this.roundRect(ctx, tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
    ctx.fill();
    ctx.stroke();
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Cor da categoria
    ctx.fillStyle = slice.color;
    ctx.fillRect(tooltipX + padding, tooltipY + padding, 15, 15);
    
    // Texto da categoria
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(slice.label, tooltipX + padding + 25, tooltipY + padding + 12);
    
    // Porcentagem
    ctx.font = '12px Arial';
    ctx.fillText(`${slice.percentage}%`, tooltipX + padding, tooltipY + padding + 35);
    
    // Quantidade total
    ctx.fillText(`Quantidade: ${slice.value}`, tooltipX + padding + 80, tooltipY + padding + 35);
    
    // Resetar sombra
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // Método auxiliar para desenhar retângulo arredondado
  roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Método para clarear uma cor (para highlight)
  lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return "#" + (
      0x1000000 + 
      (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
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
    const limiteEstoqueBaixo = 5;
    
    if (!this.produtos || this.produtos.length === 0) {
      this.lowStockAlert = 'Nenhum produto cadastrado para análise.';
      this.lowStockCount = 0;
      return;
    }

    const produtosEmAtencao = this.produtos.filter(produto => {
      if (!produto) return false;
      const quantidade = this.obterQuantidadeProduto(produto);
      return quantidade <= limiteEstoqueBaixo;
    });

    this.lowStockProducts = produtosEmAtencao.map(produto => {
      const quantidade = this.obterQuantidadeProduto(produto);
      
      return {
        id: produto.id,
        name: produto.nome || produto.name || 'Produto sem nome',
        category: produto.categoria || produto.categoria || 'Sem categoria',
        quantity: quantidade,
        maxStock: produto.estoque_maximo || produto.minStock || produto.estoque_maximo || 50
      };
    });

    this.lowStockCount = this.lowStockProducts.length;

    if (this.lowStockCount > 0) {
      this.lowStockAlert = `Atenção! Você tem ${this.lowStockCount} produto(s) com estoque baixo.`;
    } else {
      this.lowStockAlert = 'Estoque em dia! Todos os produtos estão com quantidade adequada.';
    }
  }

  private obterQuantidadeProduto(produto: any): number {
    const quantidade = produto.quantidade ?? produto.estoque ?? produto.quant ?? produto.stock ?? 0;
    const qtdNumero = Number(quantidade);
    return isNaN(qtdNumero) ? 0 : qtdNumero;
  }

  private initializeMetrics(): void {
    // Inicializar com valores padrão
    this.totalProducts = 0;
    this.stockValue = 'R$ 0,00';
    this.metricCards = [
      {
        title: 'Total de Produtos',
        value: 0,
        variation: '-',
        trend: 'neutral'
      },
      {
        title: 'Valor do Estoque',
        value: 'R$ 0,00',
        variation: '-',
        trend: 'neutral'
      },
      {
        title: 'Itens em Baixa',
        value: 0,
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
    console.log('✅ Métricas inicializadas:', this.metricCards);
  }

  private atualizarMetricas(): void {
    console.log('🔄 Atualizando métricas...', {
      produtosLength: this.produtos?.length || 0
    });
    
    this.totalProducts = this.produtos?.length || 0;
  
    let valorTotal = 0;
    if (this.produtos && this.produtos.length > 0) {
      this.produtos.forEach(produto => {
        const quantidade = this.obterQuantidadeProduto(produto);
        const preco = produto.preco || 0;
        valorTotal += preco * quantidade;
      });
    }
      
    this.stockValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valorTotal);
      
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
    
    console.log('✅ Métricas atualizadas:', {
      totalProducts: this.totalProducts,
      stockValue: this.stockValue,
      lowStockCount: this.lowStockCount
    });
  }

  private initializeCategories(): void {
    this.categories = [];
  }

  private initializeLowStockProducts(): void {
    this.lowStockProducts = [];
  }

  private carregarDadosUsuario(): void {
    const usuario = this.authService.getUsuarioLogado();
    
    if (usuario) {
      this.usuarioNome = usuario.nome;
      this.usuarioEmail = usuario.email || '';
      this.usuarioIniciais = this.gerarIniciais(this.usuarioNome);
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

  private async carregarProdutos(): Promise<void> {
    console.log('🔄 Iniciando carregamento de produtos da API...');
    
    try {
      const res = await fetch(`${environment.apiUrl}/produto`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Erro ao carregar produtos:', res.status, errorText);
        this.produtos = [];
        this.atualizarDadosGrafico();
        this.atualizarMetricas();
        this.atualizarProdutosEmBaixa();
        this.atualizarTopProdutos();
        this.atualizarMovimentacoes();
        setTimeout(() => {
          this.drawPieChart();
          this.drawBarChart();
          this.drawLineChart();
        }, 300);
        return;
      }
      
      const produtos = await res.json();
      console.log('✅ Produtos carregados da API:', produtos);
      
      // Convertendo para ProdutoComId para incluir o ID e normalizar campos
      this.produtos = (produtos || []).map((p: any) => ({
        ...p,
        id: p.id || p.id_produto,
        nome: p.nome || p.name || '',
        name: p.name || p.nome || '',
        preco: p.preco || p.preco_unitario || 0,
        quantidade: p.quantidade ?? p.estoque ?? p.quantidade_atual ?? 0,
        categoria: p.categoria || 'Sem categoria'
      })) as ProdutoComId[];
      
      // ATUALIZAR GRÁFICO COM DADOS REAIS
      this.atualizarDadosGrafico();
      
      this.atualizarMetricas();
      this.atualizarProdutosEmBaixa();
      this.atualizarTopProdutos();
      this.atualizarMovimentacoes();
      
      // Forçar detecção de mudanças
      this.cdr.detectChanges();
      
      console.log('📊 Estado após carregar produtos:', {
        totalProducts: this.totalProducts,
        stockValue: this.stockValue,
        lowStockCount: this.lowStockCount,
        topProducts: this.topProducts.length,
        movimentacoes: this.movimentacoes.length,
        produtos: this.produtos.length
      });
      
      // Redesenhar os gráficos após os dados serem atualizados
      setTimeout(() => {
        console.log('📊 Redesenhando gráficos...', {
          produtos: this.produtos.length,
          chartData: this.chartData.pie.length
        });
        this.drawPieChart();
        this.drawBarChart();
        this.drawLineChart();
        this.cdr.detectChanges();
      }, 500);
    } catch (error) {
      console.error('❌ Erro ao carregar produtos da API:', error);
      
      this.produtos = [];
      
      // ATUALIZAR GRÁFICO COM ESTADO VAZIO
      this.atualizarDadosGrafico();
      
      this.atualizarMetricas();
      this.atualizarProdutosEmBaixa();
      this.atualizarTopProdutos();
      this.atualizarMovimentacoes();
      
      // Redesenhar os gráficos
      setTimeout(() => {
        this.drawPieChart();
        this.drawBarChart();
        this.drawLineChart();
      }, 500);
    }
  }

  // Método para forçar atualização (útil para testes)
  public atualizarDados(): void {
    console.log('🔄 Forçando atualização dos dados...');
    this.carregarProdutos();
  }

  // Gráfico de Barras
  drawBarChart(): void {
    if (!this.barChart?.nativeElement) {
      console.warn('⚠️ barChart não está disponível ainda');
      return;
    }
    
    const canvas = this.barChart.nativeElement;
    const ctx = canvas.getContext('2d')!;
    
    if (!ctx) {
      console.error('❌ Não foi possível obter contexto do canvas');
      return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!this.chartData.pie || this.chartData.pie.length === 0) {
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Sem dados para exibir', canvas.width / 2, canvas.height / 2);
      return;
    }

    const padding = 40;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    const barSpacing = 10;
    const maxValue = Math.max(...this.chartData.pie.map(item => item.value));
    const barWidth = (chartWidth - (barSpacing * (this.chartData.pie.length - 1))) / this.chartData.pie.length;

    this.chartData.pie.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = padding + (index * (barWidth + barSpacing));
      const y = canvas.height - padding - barHeight;

      ctx.fillStyle = item.color;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Label da categoria
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.save();
      ctx.translate(x + barWidth / 2, canvas.height - padding + 15);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(item.label.substring(0, 10), 0, 0);
      ctx.restore();

      // Valor no topo da barra
      ctx.fillStyle = '#333';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);
    });
  }

  // Gráfico de Linha (Tendência)
  drawLineChart(): void {
    if (!this.lineChart?.nativeElement) {
      console.warn('⚠️ lineChart não está disponível ainda');
      return;
    }
    
    const canvas = this.lineChart.nativeElement;
    const ctx = canvas.getContext('2d')!;
    
    if (!ctx) {
      console.error('❌ Não foi possível obter contexto do canvas');
      return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Gerar dados simulados para os últimos 7 dias
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const totalProdutos = this.produtos.length;
    
    // Simular variação de estoque (baseado no total atual)
    const dados = dias.map((_, i) => {
      const variacao = Math.random() * 0.2 - 0.1; // -10% a +10%
      return Math.max(0, Math.round(totalProdutos * (1 + variacao)));
    });

    if (dados.every(d => d === 0)) {
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Sem dados para exibir', canvas.width / 2, canvas.height / 2);
      return;
    }

    const padding = 40;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    const maxValue = Math.max(...dados, 1);
    const stepX = chartWidth / (dias.length - 1);
    const stepY = chartHeight / maxValue;

    // Desenhar grade
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * chartHeight / 5);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Desenhar linha
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.beginPath();
    dados.forEach((valor, index) => {
      const x = padding + (index * stepX);
      const y = canvas.height - padding - (valor * stepY);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Desenhar pontos
    ctx.fillStyle = '#3498db';
    dados.forEach((valor, index) => {
      const x = padding + (index * stepX);
      const y = canvas.height - padding - (valor * stepY);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Valor acima do ponto
      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(valor.toString(), x, y - 10);
      ctx.fillStyle = '#3498db';
    });

    // Labels dos dias
    ctx.fillStyle = '#666';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    dias.forEach((dia, index) => {
      const x = padding + (index * stepX);
      ctx.fillText(dia, x, canvas.height - padding + 20);
    });
  }

  // Atualizar Top Produtos
  private atualizarTopProdutos(): void {
    if (!this.produtos || this.produtos.length === 0) {
      this.topProducts = [];
      return;
    }

    const produtosComValor = this.produtos.map(produto => {
      const quantidade = this.obterQuantidadeProduto(produto);
      const preco = produto.preco || 0;
      return {
        ...produto,
        quantidade,
        valorTotal: preco * quantidade,
        valorTotalFormatado: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(preco * quantidade)
      };
    });

    this.topProducts = produtosComValor
      .sort((a, b) => b.valorTotal - a.valorTotal)
      .slice(0, 5);
  }

  // Atualizar Movimentações (simulado por enquanto)
  private atualizarMovimentacoes(): void {
    // Simular movimentações baseadas nos produtos
    this.movimentacoes = [];
    
    if (!this.produtos || this.produtos.length === 0) {
      return;
    }

    // Pegar alguns produtos aleatórios para simular movimentações
    const produtosParaMovimentacao = this.produtos.slice(0, Math.min(5, this.produtos.length));
    
    produtosParaMovimentacao.forEach((produto, index) => {
      const diasAtras = 5 - index;
      const data = new Date();
      data.setDate(data.getDate() - diasAtras);
      
      this.movimentacoes.push({
        produto: produto.nome || produto.name || 'Produto sem nome',
        quantidade: Math.floor(Math.random() * 10) + 1,
        tipo: Math.random() > 0.5 ? 'entrada' : 'saida',
        data: data
      });
    });

    // Ordenar por data (mais recente primeiro)
    this.movimentacoes.sort((a, b) => b.data.getTime() - a.data.getTime());
  }
}