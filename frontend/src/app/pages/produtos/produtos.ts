import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ProdutoService, Produto } from '../../services/produto.service';
import { AuthService } from '../../services/auth.service';

// 1. Interfaces
interface MenuItem {
  name: string;
  active?: boolean;
}

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.html',
  styleUrls: ['./produtos.scss'],
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive]
})
export class ProdutosComponent implements OnInit {
  
  // Lista de produtos vindos da API
  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  
  // Termo de busca
  termoBusca: string = '';
  
  // Modo de visualização (grade ou tabela)
  modoVisualizacao: 'grade' | 'tabela' = 'tabela';
  
  // Dados do usuário logado
  usuarioNome: string = '';
  usuarioEmail: string = '';
  usuarioIniciais: string = '';

  // Controle de modais
  mostrarModalAdicionar: boolean = false;
  mostrarModalEditar: boolean = false;
  produtoEditando: Produto | null = null;

  // Formulário de produto
  produtoForm: Produto = {
    nome: '',
    descricao: '',
    categoria: '',
    codigo_publico: '',
    preco_unitario: undefined,
    unidade_medida: '',
    status: true
  };

  // Validação
  formularioSubmetido: boolean = false;

  constructor(
    private produtoService: ProdutoService,
    private authService: AuthService,
    private router: Router
  ) {}

  // 3. Initialize data
  ngOnInit() {
    this.carregarDadosUsuario();
    this.carregarProdutos();
  }

  /**
   * Carrega os dados do usuário logado
   */
  private carregarDadosUsuario(): void {
    const usuario = this.authService.getUsuarioLogado();
    
    if (usuario) {
      this.usuarioNome = usuario.nome || 'Usuário';
      this.usuarioEmail = usuario.email || '';
      this.usuarioIniciais = this.gerarIniciais(this.usuarioNome);
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
   * Busca produtos da API
   */
  private carregarProdutos(): void {
    this.produtoService.listarProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.produtosFiltrados = produtos;
        console.log('✅ Produtos carregados:', produtos);
        console.log('📊 Total de produtos:', produtos.length);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar produtos:', error);
        this.produtos = [];
        this.produtosFiltrados = [];
      }
    });
  }

  /**
   * Filtra produtos baseado no termo de busca
   */
  filtrarProdutos(): void {
    if (!this.termoBusca || this.termoBusca.trim() === '') {
      this.produtosFiltrados = this.produtos;
      return;
    }

    const termo = this.termoBusca.toLowerCase().trim();
    this.produtosFiltrados = this.produtos.filter(produto => {
      return (
        produto.nome?.toLowerCase().includes(termo) ||
        produto.categoria?.toLowerCase().includes(termo) ||
        produto.codigo_publico?.toLowerCase().includes(termo) ||
        produto.descricao?.toLowerCase().includes(termo)
      );
    });
  }

  /**
   * Alterna entre visualização em grade e tabela
   */
  alternarVisualizacao(): void {
    this.modoVisualizacao = this.modoVisualizacao === 'grade' ? 'tabela' : 'grade';
  }

  /**
   * Formata preço para moeda brasileira
   */
  formatarPreco(preco: number | undefined): string {
    if (!preco) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  }

  /**
   * Realiza logout do usuário
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Deleta um produto
   */
  deletarProduto(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      this.produtoService.deletarProduto(id).subscribe({
        next: () => {
          console.log('✅ Produto deletado com sucesso');
          // Recarrega a lista de produtos
          this.carregarProdutos();
        },
        error: (error) => {
          console.error('❌ Erro ao deletar produto:', error);
          alert('Erro ao deletar produto. Tente novamente.');
        }
      });
    }
  }

  /**
   * Função trackBy para melhorar performance do ngFor
   */
  trackByProdutoId(index: number, produto: Produto): number | undefined {
    return produto.id_produto;
  }

  /**
   * Abre o modal de adicionar produto
   */
  abrirModalAdicionar(): void {
    this.limparFormulario();
    this.mostrarModalAdicionar = true;
    this.formularioSubmetido = false;
  }

  /**
   * Fecha o modal de adicionar produto
   */
  fecharModalAdicionar(): void {
    this.mostrarModalAdicionar = false;
    this.limparFormulario();
    this.formularioSubmetido = false;
  }

  /**
   * Abre o modal de editar produto
   */
  abrirModalEditar(produto: Produto): void {
    if (!produto || !produto.id_produto) return;
    
    // Preenche o formulário com os dados do produto
    this.produtoForm = {
      nome: produto.nome || '',
      descricao: produto.descricao || '',
      categoria: produto.categoria || '',
      codigo_publico: produto.codigo_publico || '',
      preco_unitario: produto.preco_unitario || undefined,
      unidade_medida: produto.unidade_medida || '',
      status: produto.status !== undefined ? produto.status : true
    };
    
    this.produtoEditando = produto;
    this.mostrarModalEditar = true;
    this.formularioSubmetido = false;
  }

  /**
   * Fecha o modal de editar produto
   */
  fecharModalEditar(): void {
    this.mostrarModalEditar = false;
    this.produtoEditando = null;
    this.limparFormulario();
    this.formularioSubmetido = false;
  }

  /**
   * Limpa o formulário
   */
  private limparFormulario(): void {
    this.produtoForm = {
      nome: '',
      descricao: '',
      categoria: '',
      codigo_publico: '',
      preco_unitario: undefined,
      unidade_medida: '',
      status: true
    };
  }

  /**
   * Valida o formulário
   */
  validarFormulario(): boolean {
    return !!(
      this.produtoForm.nome && 
      this.produtoForm.nome.trim() !== ''
    );
  }

  /**
   * Salva um novo produto
   */
  salvarProduto(): void {
    this.formularioSubmetido = true;

    if (!this.validarFormulario()) {
      return;
    }

    // Prepara os dados para enviar
    const produtoParaSalvar: Produto = {
      nome: this.produtoForm.nome.trim(),
      descricao: this.produtoForm.descricao?.trim() || undefined,
      categoria: this.produtoForm.categoria?.trim() || undefined,
      codigo_publico: this.produtoForm.codigo_publico?.trim() || undefined,
      preco_unitario: this.produtoForm.preco_unitario || undefined,
      unidade_medida: this.produtoForm.unidade_medida?.trim() || undefined,
      status: this.produtoForm.status !== undefined ? this.produtoForm.status : true
    };

    this.produtoService.criarProduto(produtoParaSalvar).subscribe({
      next: (response) => {
        console.log('✅ Produto criado com sucesso:', response);
        this.fecharModalAdicionar();
        this.carregarProdutos();
        alert('Produto criado com sucesso!');
      },
      error: (error) => {
        console.error('❌ Erro ao criar produto:', error);
        alert('Erro ao criar produto. Verifique os dados e tente novamente.');
      }
    });
  }

  /**
   * Atualiza um produto existente
   */
  atualizarProduto(): void {
    if (!this.produtoEditando || !this.produtoEditando.id_produto) {
      alert('Erro: Produto não encontrado para edição.');
      return;
    }

    this.formularioSubmetido = true;

    if (!this.validarFormulario()) {
      return;
    }

    // Prepara os dados para atualizar
    const produtoParaAtualizar: Partial<Produto> = {
      nome: this.produtoForm.nome.trim(),
      descricao: this.produtoForm.descricao?.trim() || undefined,
      categoria: this.produtoForm.categoria?.trim() || undefined,
      codigo_publico: this.produtoForm.codigo_publico?.trim() || undefined,
      preco_unitario: this.produtoForm.preco_unitario || undefined,
      unidade_medida: this.produtoForm.unidade_medida?.trim() || undefined,
      status: this.produtoForm.status !== undefined ? this.produtoForm.status : true
    };

    this.produtoService.atualizarProduto(
      this.produtoEditando.id_produto,
      produtoParaAtualizar
    ).subscribe({
      next: (response) => {
        console.log('✅ Produto atualizado com sucesso:', response);
        this.fecharModalEditar();
        this.carregarProdutos();
        alert('Produto atualizado com sucesso!');
      },
      error: (error) => {
        console.error('❌ Erro ao atualizar produto:', error);
        alert('Erro ao atualizar produto. Verifique os dados e tente novamente.');
      }
    });
  }
}