-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_alerta" (
    "id_alerta" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produto" INTEGER NOT NULL,
    "tipo_alerta" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    CONSTRAINT "alerta_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_alerta" ("id_alerta", "id_produto", "mensagem", "tipo_alerta") SELECT "id_alerta", "id_produto", "mensagem", "tipo_alerta" FROM "alerta";
DROP TABLE "alerta";
ALTER TABLE "new_alerta" RENAME TO "alerta";
CREATE TABLE "new_compra" (
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
    CONSTRAINT "compra_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "compra_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "fornecedor" ("id_fornecedor") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "compra_id_financeiro_fkey" FOREIGN KEY ("id_financeiro") REFERENCES "financeiro" ("id_financeiro") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "compra_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_compra" ("data_pedido", "data_recebimento", "id_compra", "id_financeiro", "id_fornecedor", "id_produto", "id_usuario", "observacoes", "origem", "valor_total") SELECT "data_pedido", "data_recebimento", "id_compra", "id_financeiro", "id_fornecedor", "id_produto", "id_usuario", "observacoes", "origem", "valor_total" FROM "compra";
DROP TABLE "compra";
ALTER TABLE "new_compra" RENAME TO "compra";
CREATE TABLE "new_estoque" (
    "id_estoque" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produto" INTEGER NOT NULL,
    "id_sala" INTEGER NOT NULL,
    "quantidade_atual" INTEGER NOT NULL,
    "quantidade_minima" INTEGER NOT NULL,
    "ultima_atualizacao" DATETIME NOT NULL,
    "status" TEXT,
    CONSTRAINT "estoque_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "estoque_id_sala_fkey" FOREIGN KEY ("id_sala") REFERENCES "sala" ("id_sala") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_estoque" ("id_estoque", "id_produto", "id_sala", "quantidade_atual", "quantidade_minima", "status", "ultima_atualizacao") SELECT "id_estoque", "id_produto", "id_sala", "quantidade_atual", "quantidade_minima", "status", "ultima_atualizacao" FROM "estoque";
DROP TABLE "estoque";
ALTER TABLE "new_estoque" RENAME TO "estoque";
CREATE TABLE "new_garantia" (
    "id_garantia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produto" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME NOT NULL,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Ativa',
    CONSTRAINT "garantia_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "garantia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_garantia" ("data_fim", "data_inicio", "descricao", "id_garantia", "id_produto", "id_usuario", "status") SELECT "data_fim", "data_inicio", "descricao", "id_garantia", "id_produto", "id_usuario", "status" FROM "garantia";
DROP TABLE "garantia";
ALTER TABLE "new_garantia" RENAME TO "garantia";
CREATE TABLE "new_historico_previsao" (
    "id_historico" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produto" INTEGER NOT NULL,
    "id_previsao" INTEGER NOT NULL,
    "id_financeiro" INTEGER,
    "demanda_real" INTEGER NOT NULL,
    "diferenca" INTEGER NOT NULL,
    "precisao_modelo" REAL,
    CONSTRAINT "historico_previsao_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "historico_previsao_id_previsao_fkey" FOREIGN KEY ("id_previsao") REFERENCES "previsao_demanda" ("id_previsao") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "historico_previsao_id_financeiro_fkey" FOREIGN KEY ("id_financeiro") REFERENCES "financeiro" ("id_financeiro") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_historico_previsao" ("demanda_real", "diferenca", "id_financeiro", "id_historico", "id_previsao", "id_produto", "precisao_modelo") SELECT "demanda_real", "diferenca", "id_financeiro", "id_historico", "id_previsao", "id_produto", "precisao_modelo" FROM "historico_previsao";
DROP TABLE "historico_previsao";
ALTER TABLE "new_historico_previsao" RENAME TO "historico_previsao";
CREATE TABLE "new_movimentacao" (
    "id_movimentacao" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produto" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tipo_movimentacao" TEXT NOT NULL,
    "origem" TEXT,
    "data_movimento" DATETIME NOT NULL,
    "status" TEXT,
    "observacao" TEXT,
    CONSTRAINT "movimentacao_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "movimentacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_movimentacao" ("data_movimento", "id_movimentacao", "id_produto", "id_usuario", "observacao", "origem", "status", "tipo_movimentacao") SELECT "data_movimento", "id_movimentacao", "id_produto", "id_usuario", "observacao", "origem", "status", "tipo_movimentacao" FROM "movimentacao";
DROP TABLE "movimentacao";
ALTER TABLE "new_movimentacao" RENAME TO "movimentacao";
CREATE TABLE "new_previsao_demanda" (
    "id_previsao" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produto" INTEGER NOT NULL,
    "data_prevista" DATETIME NOT NULL,
    "demanda_prevista" INTEGER NOT NULL,
    "id_financeiro" INTEGER,
    "confianca_modelo" REAL,
    CONSTRAINT "previsao_demanda_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_previsao_demanda" ("confianca_modelo", "data_prevista", "demanda_prevista", "id_financeiro", "id_previsao", "id_produto") SELECT "confianca_modelo", "data_prevista", "demanda_prevista", "id_financeiro", "id_previsao", "id_produto" FROM "previsao_demanda";
DROP TABLE "previsao_demanda";
ALTER TABLE "new_previsao_demanda" RENAME TO "previsao_demanda";
CREATE TABLE "new_produto" (
    "id_produto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT,
    "codigo_publico" TEXT,
    "preco_unitario" REAL,
    "unidade_medida" TEXT,
    "id_fornecedor" INTEGER,
    "status" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "produto_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "fornecedor" ("id_fornecedor") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_produto" ("categoria", "codigo_publico", "descricao", "id_fornecedor", "id_produto", "nome", "preco_unitario", "status", "unidade_medida") SELECT "categoria", "codigo_publico", "descricao", "id_fornecedor", "id_produto", "nome", "preco_unitario", "status", "unidade_medida" FROM "produto";
DROP TABLE "produto";
ALTER TABLE "new_produto" RENAME TO "produto";
CREATE TABLE "new_relatorio" (
    "id_relatorio" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_usuario" INTEGER NOT NULL,
    "tipo_relatorio" TEXT NOT NULL,
    "caminho_arquivo" TEXT NOT NULL,
    "gerado_por" TEXT NOT NULL,
    "gerado_em" DATETIME NOT NULL,
    "status" TEXT,
    CONSTRAINT "relatorio_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_relatorio" ("caminho_arquivo", "gerado_em", "gerado_por", "id_relatorio", "id_usuario", "status", "tipo_relatorio") SELECT "caminho_arquivo", "gerado_em", "gerado_por", "id_relatorio", "id_usuario", "status", "tipo_relatorio" FROM "relatorio";
DROP TABLE "relatorio";
ALTER TABLE "new_relatorio" RENAME TO "relatorio";
CREATE TABLE "new_usuario" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "id_tipo_usuario" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpf" TEXT,
    CONSTRAINT "usuario_id_tipo_usuario_fkey" FOREIGN KEY ("id_tipo_usuario") REFERENCES "tipo_usuario" ("id_tipo_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_usuario" ("ativo", "cpf", "criado_em", "email", "id_tipo_usuario", "id_usuario", "nome", "senha_hash") SELECT "ativo", "cpf", "criado_em", "email", "id_tipo_usuario", "id_usuario", "nome", "senha_hash" FROM "usuario";
DROP TABLE "usuario";
ALTER TABLE "new_usuario" RENAME TO "usuario";
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
