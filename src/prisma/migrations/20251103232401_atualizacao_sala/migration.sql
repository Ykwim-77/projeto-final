-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sala" (
    "id_sala" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_sala" TEXT NOT NULL,
    "descricao" TEXT,
    "capacidade" INTEGER NOT NULL,
    "localizacao" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_sala" ("capacidade", "descricao", "id_sala", "localizacao", "nome_sala") SELECT "capacidade", "descricao", "id_sala", "localizacao", "nome_sala" FROM "sala";
DROP TABLE "sala";
ALTER TABLE "new_sala" RENAME TO "sala";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
