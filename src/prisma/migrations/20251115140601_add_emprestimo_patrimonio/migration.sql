-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_emprestimo" (
    "id_emprestimo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data_pedido" DATETIME NOT NULL,
    "data_recebimento" DATETIME,
    "valor_total" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "observacoes" TEXT,
    "id_usuario" INTEGER NOT NULL,
    "id_patrimonio" INTEGER,
    CONSTRAINT "emprestimo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "emprestimo_id_patrimonio_fkey" FOREIGN KEY ("id_patrimonio") REFERENCES "patrimonio" ("id_patrimonio") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_emprestimo" ("data_pedido", "data_recebimento", "id_emprestimo", "id_usuario", "observacoes", "status", "valor_total") SELECT "data_pedido", "data_recebimento", "id_emprestimo", "id_usuario", "observacoes", "status", "valor_total" FROM "emprestimo";
DROP TABLE "emprestimo";
ALTER TABLE "new_emprestimo" RENAME TO "emprestimo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
