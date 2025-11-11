/*
  Warnings:

  - You are about to drop the `produto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `id_produto` on the `alerta` table. All the data in the column will be lost.
  - You are about to drop the column `id_produto` on the `compra` table. All the data in the column will be lost.
  - You are about to drop the column `id_produto` on the `garantia` table. All the data in the column will be lost.
  - You are about to drop the column `id_produto` on the `movimentacao` table. All the data in the column will be lost.
  - Added the required column `id_patromonio` to the `alerta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_patromonio` to the `compra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_patromonio` to the `garantia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_patromonio` to the `movimentacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "produto";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "patromonio" (
    "id_patromonio" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT,
    "codigo_publico" TEXT,
    "preco_unitario" REAL,
    "unidade_medida" TEXT,
    "id_fornecedor" INTEGER,
    "status" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "patromonio_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "fornecedor" ("id_fornecedor") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_alerta" (
    "id_alerta" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_patromonio" INTEGER NOT NULL,
    "tipo_alerta" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    CONSTRAINT "alerta_id_patromonio_fkey" FOREIGN KEY ("id_patromonio") REFERENCES "patromonio" ("id_patromonio") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_alerta" ("id_alerta", "mensagem", "tipo_alerta") SELECT "id_alerta", "mensagem", "tipo_alerta" FROM "alerta";
DROP TABLE "alerta";
ALTER TABLE "new_alerta" RENAME TO "alerta";
CREATE TABLE "new_compra" (
    "id_compra" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_patromonio" INTEGER NOT NULL,
    "id_fornecedor" INTEGER NOT NULL,
    "id_financeiro" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "data_pedido" DATETIME NOT NULL,
    "data_recebimento" DATETIME,
    "valor_total" REAL NOT NULL,
    "origem" TEXT,
    "observacoes" TEXT,
    CONSTRAINT "compra_id_patromonio_fkey" FOREIGN KEY ("id_patromonio") REFERENCES "patromonio" ("id_patromonio") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "compra_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "fornecedor" ("id_fornecedor") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "compra_id_financeiro_fkey" FOREIGN KEY ("id_financeiro") REFERENCES "financeiro" ("id_financeiro") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "compra_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_compra" ("data_pedido", "data_recebimento", "id_compra", "id_financeiro", "id_fornecedor", "id_usuario", "observacoes", "origem", "valor_total") SELECT "data_pedido", "data_recebimento", "id_compra", "id_financeiro", "id_fornecedor", "id_usuario", "observacoes", "origem", "valor_total" FROM "compra";
DROP TABLE "compra";
ALTER TABLE "new_compra" RENAME TO "compra";
CREATE TABLE "new_garantia" (
    "id_garantia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_patromonio" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME NOT NULL,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Ativa',
    CONSTRAINT "garantia_id_patromonio_fkey" FOREIGN KEY ("id_patromonio") REFERENCES "patromonio" ("id_patromonio") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "garantia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_garantia" ("data_fim", "data_inicio", "descricao", "id_garantia", "id_usuario", "status") SELECT "data_fim", "data_inicio", "descricao", "id_garantia", "id_usuario", "status" FROM "garantia";
DROP TABLE "garantia";
ALTER TABLE "new_garantia" RENAME TO "garantia";
CREATE TABLE "new_movimentacao" (
    "id_movimentacao" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_patromonio" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tipo_movimentacao" TEXT NOT NULL,
    "origem" TEXT,
    "data_movimento" DATETIME NOT NULL,
    "status" TEXT,
    "observacao" TEXT,
    CONSTRAINT "movimentacao_id_patromonio_fkey" FOREIGN KEY ("id_patromonio") REFERENCES "patromonio" ("id_patromonio") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "movimentacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_movimentacao" ("data_movimento", "id_movimentacao", "id_usuario", "observacao", "origem", "status", "tipo_movimentacao") SELECT "data_movimento", "id_movimentacao", "id_usuario", "observacao", "origem", "status", "tipo_movimentacao" FROM "movimentacao";
DROP TABLE "movimentacao";
ALTER TABLE "new_movimentacao" RENAME TO "movimentacao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
