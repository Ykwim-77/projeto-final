import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Added missing import

// 1. Interfaces
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
  imports: [CommonModule] // Now correctly using imported CommonModule
})
export class ProdutosComponent implements OnInit {
  
  // 2. Declare ALL properties used in the class and template
  menuItems: MenuItem[] = []; // Added missing property
  lowStockCount: number = 0; // Added missing property
  lowStockAlert: string = ''; // Added missing property
  
  // Cards de Métricas
  metricCards: MetricCard[] = [];
  
  // Dados individuais
  totalProducts: number = 0;
  stockValue: string = '';
  
  // Listas
  categories: Category[] = [];
  lowStockProducts: LowStockProduct[] = [];

  // 3. Initialize data
  ngOnInit() {
    this.initializeMenu();
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
      { name: 'Usuários' },
      { name: 'Configurações' }
    ];
  }

  private initializeAlerts(): void {
    this.lowStockCount = 2;
    this.lowStockAlert = `Atenção! Você tem ${this.lowStockCount} produto(s) com estoque baixo.`;
  }

  private initializeMetrics(): void {
    this.totalProducts = 5;
    this.stockValue = 'R$ 13723.60';
    
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
        trend: 'negative'
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
    this.lowStockProducts = [
      { name: 'Shampoo Profissional', category: 'Cosméticos' },
      { name: 'Teclado Mecânico', category: 'Eletrônicos' },
      { name: 'Sessio', category: 'Alimentos' }
    ];
  }
}