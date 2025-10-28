-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "produto_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "fornecedor" ("id_fornecedor") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_produto" ("categoria", "codigo_publico", "descricao", "id_fornecedor", "id_produto", "nome", "preco_unitario", "unidade_medida") SELECT "categoria", "codigo_publico", "descricao", "id_fornecedor", "id_produto", "nome", "preco_unitario", "unidade_medida" FROM "produto";
DROP TABLE "produto";
ALTER TABLE "new_produto" RENAME TO "produto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
