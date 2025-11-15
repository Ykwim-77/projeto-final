/*
  Warnings:

  - You are about to drop the column `status` on the `sala` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "emprestimo" (
    "id_emprestimo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data_pedido" DATETIME NOT NULL,
    "data_recebimento" DATETIME,
    "valor_total" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "observacoes" TEXT,
    "id_usuario" INTEGER NOT NULL,
    CONSTRAINT "emprestimo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sala" (
    "id_sala" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_sala" TEXT NOT NULL,
    "descricao" TEXT,
    "capacidade" INTEGER NOT NULL,
    "localizacao" TEXT
);
INSERT INTO "new_sala" ("capacidade", "descricao", "id_sala", "localizacao", "nome_sala") SELECT "capacidade", "descricao", "id_sala", "localizacao", "nome_sala" FROM "sala";
DROP TABLE "sala";
ALTER TABLE "new_sala" RENAME TO "sala";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
