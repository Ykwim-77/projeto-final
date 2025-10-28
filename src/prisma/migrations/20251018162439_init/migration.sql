-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "id_tipo_usuario" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CPF" TEXT,
    CONSTRAINT "usuario_id_tipo_usuario_fkey" FOREIGN KEY ("id_tipo_usuario") REFERENCES "tipo_usuario" ("id_tipo_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tipo_usuario" (
    "id_tipo_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "produto" (
    "id_produto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT,
    "codigo_publico" TEXT,
    "preco_unitario" REAL,
    "unidade_medida" TEXT,
    "id_fornecedor" INTEGER,
    CONSTRAINT "produto_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "fornecedor" ("id_fornecedor") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "estoque" (
    "id_estoque" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produto" INTEGER NOT NULL,
    "id_sala" INTEGER NOT NULL,
    "quantidade_atual" INTEGER NOT NULL,
    "quantidade_minima" INTEGER NOT NULL,
    "ultima_atualizacao" DATETIME NOT NULL,
    "status" TEXT,
    CONSTRAINT "estoque_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "estoque_id_sala_fkey" FOREIGN KEY ("id_sala") REFERENCES "sala" ("id_sala") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "financeiro" (
    "id_financeiro" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "data_movimento" DATETIME NOT NULL,
    "status" TEXT
);

-- CreateTable
CREATE TABLE "compra" (
    "id_compra" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produto" INTEGER NOT NULL,
    "id_fornecedor" INTEGER NOT NULL,
    "id_financeiro" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "data_pedido" DATETIME NOT NULL,
    "data_recebimento" DATETIME,
    "valor_total" REAL NOT NULL,
    "origem" TEXT,
    "observacoes" TEXT,
    CONSTRAINT "compra_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "compra_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "fornecedor" ("id_fornecedor") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "compra_id_financeiro_fkey" FOREIGN KEY ("id_financeiro") REFERENCES "financeiro" ("id_financeiro") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "compra_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sala" (
    "id_sala" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_sala" TEXT NOT NULL,
    "descricao" TEXT,
    "capacidade" INTEGER NOT NULL,
    "localizacao" TEXT
);

-- CreateTable
CREATE TABLE "movimentacao" (
    "id_movimentacao" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produto" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tipo_movimentacao" TEXT NOT NULL,
    "origem" TEXT,
    "data_movimento" DATETIME NOT NULL,
    "status" TEXT,
    "observacao" TEXT,
    CONSTRAINT "movimentacao_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "movimentacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "alerta" (
    "id_alerta" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produto" INTEGER NOT NULL,
    "tipo_alerta" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    CONSTRAINT "alerta_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "previsao_demanda" (
    "id_previsao" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produto" INTEGER NOT NULL,
    "data_prevista" DATETIME NOT NULL,
    "demanda_prevista" INTEGER NOT NULL,
    "id_financeiro" INTEGER,
    "confianca_modelo" REAL,
    CONSTRAINT "previsao_demanda_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fornecedor" (
    "id_fornecedor" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "endereco" TEXT
);

-- CreateTable
CREATE TABLE "historico_previsao" (
    "id_historico" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produto" INTEGER NOT NULL,
    "id_previsao" INTEGER NOT NULL,
    "id_financeiro" INTEGER,
    "demanda_real" INTEGER NOT NULL,
    "diferenca" INTEGER NOT NULL,
    "precisao_modelo" REAL,
    CONSTRAINT "historico_previsao_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "historico_previsao_id_previsao_fkey" FOREIGN KEY ("id_previsao") REFERENCES "previsao_demanda" ("id_previsao") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "historico_previsao_id_financeiro_fkey" FOREIGN KEY ("id_financeiro") REFERENCES "financeiro" ("id_financeiro") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "relatorio" (
    "id_relatorio" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_usuario" INTEGER NOT NULL,
    "tipo_relatorio" TEXT NOT NULL,
    "caminho_arquivo" TEXT NOT NULL,
    "gerado_por" TEXT NOT NULL,
    "gerado_em" DATETIME NOT NULL,
    "status" TEXT,
    CONSTRAINT "relatorio_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
