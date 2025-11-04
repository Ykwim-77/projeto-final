import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoService, Produto } from '../../services/produto.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChart') pieChart!: ElementRef<HTMLCanvasElement>;

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
  
  // Propriedade para armazenar produtos da API
  produtos: Produto[] = [];

  // Dados do usuário logado
  usuarioNome: string = '';
  usuarioEmail: string = '';
  usuarioIniciais: string = '';

  // Dados do gráfico de pizza
  chartData = {
    pie: [
      { label: 'Eletrônicos', value: 75, color: '#1E2A4F' },
      { label: 'Alimentos', value: 120, color: '#2C3E6F' },
      { label: 'Papelaria', value: 85, color: '#10B981' },
      { label: 'Limpeza', value: 60, color: '#F59E0B' },
      { label: 'Escritório', value: 45, color: '#EF4444' }
    ]
  };

  // Variáveis para controle do tooltip
  private hoveredSlice: any = null;

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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.drawPieChart();
      this.setupEventListeners();
    }, 100);
  }

  // Gráfico de Pizza com Tooltip
  drawPieChart(): void {
    if (!this.pieChart?.nativeElement) return;
    
    const canvas = this.pieChart.nativeElement;
    const ctx = canvas.getContext('2d')!;
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const total = this.chartData.pie.reduce((sum, item) => sum + item.value, 0);
    
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
        ctx.fillStyle = this.lightenColor(item.color, 20); // Cor mais clara
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
      
      // Verificar se o mouse está sobre alguma fatia
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;
      
      const newHoveredSlice = this.getHoveredSlice(mouseX, mouseY, centerX, centerY, radius);
      
      // Mudar cursor se estiver sobre uma fatia
      canvas.style.cursor = newHoveredSlice ? 'pointer' : 'default';
      
      // Redesenhar apenas se o hover mudou
      if (this.hoveredSlice?.label !== newHoveredSlice?.label) {
        this.hoveredSlice = newHoveredSlice;
        this.drawPieChart();
      }
    });

    canvas.addEventListener('mouseleave', () => {
      this.hoveredSlice = null;
      this.drawPieChart();
    });

    // Adicionar evento de clique (opcional)
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
    // Calcular ângulo do mouse em relação ao centro
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Se o mouse está fora do círculo, retorna null
    if (distance > radius) return null;
    
    // Calcular ângulo em radianos
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += 2 * Math.PI;
    
    const total = this.chartData.pie.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    // Encontrar a fatia correspondente ao ângulo
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
    const tooltipWidth = 180;
    const tooltipHeight = 60;
    const padding = 10;
    
    // Posição do tooltip (canto superior direito)
    const tooltipX = 10;
    const tooltipY = 10;
    
    // Fundo do tooltip
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    this.roundRect(ctx, tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
    ctx.fill();
    ctx.stroke();
    
    // Sombra
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
    
    // Valor
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
    console.log('=== ATUALIZANDO PRODUTOS EM BAIXA ===');
    console.log('Produtos disponíveis:', this.produtos);
    
    this.lowStockProducts = [];
    const limiteEstoqueBaixo = 5;
    
    if (!this.produtos || this.produtos.length === 0) {
      console.log('Nenhum produto disponível para análise');
      this.lowStockAlert = 'Nenhum produto cadastrado para análise.';
      this.lowStockCount = 0;
      return;
    }

    const produtosEmAtencao = this.produtos.filter(produto => {
      if (!produto) return false;
      
      // Obter quantidade usando diferentes possíveis nomes de propriedades
      const quantidade = this.obterQuantidadeProduto(produto);
      console.log(`Produto: ${produto.nome || produto.name}, Quantidade: ${quantidade}, Limite: ${limiteEstoqueBaixo}`);
      
      return quantidade <= limiteEstoqueBaixo;
    });

    console.log('Produtos em atenção encontrados:', produtosEmAtencao);

    this.lowStockProducts = produtosEmAtencao.map(produto => {
      const quantidade = this.obterQuantidadeProduto(produto);
      
      return {
        name: produto.nome || produto.name || 'Produto sem nome',
        category: produto.categoria || produto.categoria || 'Sem categoria',
        quantity: quantidade,
        maxStock: produto.estoque_maximo || produto.maxStock || produto.estoque_maximo || 50
      };
    });

    this.lowStockCount = this.lowStockProducts.length;
    
    console.log('Low stock products final:', this.lowStockProducts);
    console.log('Low stock count:', this.lowStockCount);

    if (this.lowStockCount > 0) {
      this.lowStockAlert = `Atenção! Você tem ${this.lowStockCount} produto(s) com estoque baixo.`;
    } else {
      this.lowStockAlert = 'Estoque em dia! Todos os produtos estão com quantidade adequada.';
    }
  }

  private obterQuantidadeProduto(produto: any): number {
    // Tenta diferentes nomes de propriedades possíveis para quantidade
    const quantidade = produto.quantidade ?? produto.estoque ?? produto.quant ?? produto.stock ?? 0;
    
    // Converte para número e trata valores inválidos
    const qtdNumero = Number(quantidade);
    return isNaN(qtdNumero) ? 0 : qtdNumero;
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
        valorTotal += produto.preco_unitario * (produto.quantidade || 1);
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