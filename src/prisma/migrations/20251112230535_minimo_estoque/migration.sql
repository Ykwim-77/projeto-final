-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_patrimonio" (
    "id_patrimonio" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT,
    "codigo_publico" TEXT,
    "preco_unitario" REAL,
    "unidade_medida" TEXT,
    "id_fornecedor" INTEGER,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "min_estoque" INTEGER NOT NULL,
    "estoque" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "patrimonio_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "fornecedor" ("id_fornecedor") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_patrimonio" ("categoria", "codigo_publico", "descricao", "estoque", "id_fornecedor", "id_patrimonio", "min_estoque", "nome", "preco_unitario", "status", "unidade_medida") SELECT "categoria", "codigo_publico", "descricao", "estoque", "id_fornecedor", "id_patrimonio", "min_estoque", "nome", "preco_unitario", "status", "unidade_medida" FROM "patrimonio";
DROP TABLE "patrimonio";
ALTER TABLE "new_patrimonio" RENAME TO "patrimonio";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
